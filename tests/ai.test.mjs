import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { getAIAnalysis } from '../src/ai.js';
import { parseAnalysis } from '../src/analysis.js';

const analysis = {
  atsScore: 75, keywordMatchScore: 70, formattingScore: 80, impactScore: 65,
  summary: 'Clear experience; add quantified achievements.',
  missingKeywords: ['SQL'], actionVerbs: ['Built'], quickWins: ['Add metrics.'],
  weakBullets: [{ original: 'Worked on APIs', improved: 'Built APIs', tip: 'Add real metrics.' }],
  formattingIssues: [{ title: 'Columns', detail: 'Use a single column.', severity: 'Warning' }],
  recommendedRoles: [{ title: 'Developer', reason: 'Relevant experience.', matchPercent: 80, matchedSkills: ['JS'], skillsToLearn: ['SQL'] }],
  jobMatch: null,
};
const geminiResponse = (text) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }));
const routerResponse = (text) => new Response(JSON.stringify({ choices: [{ message: { content: text } }] }));

beforeEach((t) => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'warn', () => {});
  const original = globalThis.window;
  globalThis.window = { location: { origin: 'http://localhost:5173' } };
  t.after(() => { globalThis.window = original; });
});

test('accepts fenced JSON and rejects data that would break the dashboard', () => {
  assert.deepEqual(parseAnalysis('```json\n' + JSON.stringify(analysis) + '\n```'), analysis);
  for (const invalid of [
    {}, { ...analysis, atsScore: 101 }, { ...analysis, missingKeywords: 'SQL' },
    { ...analysis, recommendedRoles: [null] }, { ...analysis, summary: {} },
    { ...analysis, weakBullets: [{ original: {}, improved: 'Text' }] },
    { ...analysis, jobMatch: { verdict: 'Fit', matchPercent: 90, matched: {}, missing: [] } },
  ]) assert.throws(() => parseAnalysis(JSON.stringify(invalid)));
  assert.throws(() => parseAnalysis('{"summary":'));
});

test('retries invalid Gemini JSON and invalid schema before accepting a report', async (t) => {
  const models = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    models.push(url.match(/models\/(.*):generateContent/)[1]);
    assert.ok(options.signal instanceof AbortSignal);
    return geminiResponse(['not JSON', '{}', JSON.stringify(analysis)][models.length - 1]);
  });
  const result = await getAIAnalysis('Resume', { geminiKey: 'test-key' });
  assert.deepEqual(result.result, analysis);
  assert.deepEqual(models, ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash']);
});

test('ignores Gemini thought parts when parsing the final answer', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [
    { thought: true, text: 'Reasoning with {braces}' }, { text: JSON.stringify(analysis) },
  ] } }] })));
  assert.deepEqual((await getAIAnalysis('Resume', { geminiKey: 'test-key' })).result, analysis);
});

test('falls back across providers after HTTP errors, even with a success-shaped body', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push(url);
    if (url.includes('googleapis')) return new Response(await geminiResponse(JSON.stringify(analysis)).text(), { status: 503 });
    assert.equal(JSON.parse(options.body).model, 'nvidia/nemotron-3.5-lightning:free');
    return routerResponse(JSON.stringify(analysis));
  });
  const result = await getAIAnalysis('Resume', { geminiKey: 'test', openrouterKey: 'test' });
  assert.match(result.provider, /^OpenRouter/);
  assert.equal(calls.length, 4);
});

test('OpenRouter retries network, non-JSON, and invalid report failures through its free router', async (t) => {
  const models = [];
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    models.push(JSON.parse(options.body).model);
    if (models.length === 1) throw new Error('Connection failed');
    if (models.length === 2) return new Response('Bad gateway', { status: 502 });
    if (models.length === 3) return routerResponse('{}');
    return routerResponse(JSON.stringify(analysis));
  });
  const result = await getAIAnalysis('Resume', { openrouterKey: 'test' });
  assert.deepEqual(result.result, analysis);
  assert.deepEqual(models, ['nvidia/nemotron-3.5-lightning:free', 'thinkingmachines/inkling-small:free', 'poolside/laguna-s-2.1:free', 'openrouter/free']);
});

test('missing keys do not send requests', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => assert.fail('Unexpected request'));
  await assert.rejects(getAIAnalysis('Resume', {}), /No AI API key/);
  assert.equal(fetch.mock.callCount(), 0);
});

test('a timed-out model advances to the next fallback', async (t) => {
  let attempt = 0;
  t.mock.method(AbortSignal, 'timeout', (milliseconds) => {
    assert.equal(milliseconds, 30000);
    attempt += 1;
    return attempt === 1
      ? AbortSignal.abort(new DOMException('Request timed out', 'TimeoutError'))
      : new AbortController().signal;
  });
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    options.signal.throwIfAborted();
    return geminiResponse(JSON.stringify(analysis));
  });
  const result = await getAIAnalysis('Resume', { geminiKey: 'test' });
  assert.equal(result.provider, 'Gemini (gemini-3.7-flash)');
  assert.equal(attempt, 2);
});

test('all models failing rejects without returning an invalid report', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ error: { message: 'Quota exceeded' } }), { status: 429 }));
  await assert.rejects(getAIAnalysis('Resume', { geminiKey: 'test', openrouterKey: 'test' }), /Quota exceeded/);
  assert.equal(fetch.mock.callCount(), 7);
});
