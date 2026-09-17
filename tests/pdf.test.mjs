import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractTextFromPDF } from '../src/pdf.js';

const file = { arrayBuffer: async () => new ArrayBuffer(2) };
function library(texts) {
  let destroyed = 0;
  return {
    GlobalWorkerOptions: {},
    get destroyed() { return destroyed; },
    getDocument: () => ({
      promise: Promise.resolve({ numPages: texts.length, getPage: async (n) => ({ getTextContent: async () => ({ items: [{ str: texts[n - 1] }] }) }) }),
      destroy: async () => { destroyed += 1; },
    }),
  };
}

test('loads the PDF reader once for concurrent selections and extracts every page', async () => {
  const pdf = library(['First page', 'Second page']);
  globalThis.window = {};
  let loads = 0;
  globalThis.document = {
    createElement: () => ({}),
    head: { appendChild(script) {
      loads += 1;
      queueMicrotask(() => { window.pdfjsLib = pdf; script.onload(); });
    } },
  };
  assert.deepEqual(await Promise.all([extractTextFromPDF(file), extractTextFromPDF(file)]), ['First page\nSecond page', 'First page\nSecond page']);
  assert.equal(loads, 1);
  assert.equal(pdf.destroyed, 2);
  assert.match(pdf.GlobalWorkerOptions.workerSrc, /pdf.worker.min.js$/);
});

test('rejects scanned or empty PDFs and releases PDF resources', async () => {
  const pdf = library(['  ', '']);
  globalThis.window = { pdfjsLib: pdf };
  await assert.rejects(extractTextFromPDF(file), /no readable text/);
  assert.equal(pdf.destroyed, 1);
});

test('releases resources when PDF parsing fails', async () => {
  let destroyed = false;
  globalThis.window = { pdfjsLib: {
    GlobalWorkerOptions: {},
    getDocument: () => ({ promise: Promise.reject(new Error('Invalid PDF')), destroy: async () => { destroyed = true; } }),
  } };
  await assert.rejects(extractTextFromPDF(file), /Invalid PDF/);
  assert.equal(destroyed, true);
});

test('PDF reader download failures are visible and can be retried', async () => {
  // Fresh module instance to exercise a new library download.
  const { extractTextFromPDF: extract } = await import('../src/pdf.js?retry-test');
  globalThis.window = {};
  let attempts = 0;
  let removed = 0;
  globalThis.document = {
    createElement: () => ({ remove() { removed += 1; } }),
    head: { appendChild(script) {
      attempts += 1;
      queueMicrotask(() => {
        if (attempts === 1) script.onerror();
        else { window.pdfjsLib = library(['Resume']); script.onload(); }
      });
    } },
  };
  await assert.rejects(extract(file), /Could not load the PDF reader/);
  assert.equal(await extract(file), 'Resume');
  assert.equal(attempts, 2);
  assert.equal(removed, 1);
});
