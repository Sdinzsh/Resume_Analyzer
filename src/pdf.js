const PDF_SCRIPT = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDF_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
let pdfLibraryPromise;

function loadPdfLibrary() {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER;
    return Promise.resolve(window.pdfjsLib);
  }
  if (!pdfLibraryPromise) {
    pdfLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const fail = () => {
        clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
        script.remove();
        reject(new Error("Could not load the PDF reader. Check your connection and select the file again."));
      };
      const timer = setTimeout(fail, 15000);
      script.src = PDF_SCRIPT;
      script.onload = () => {
        if (!window.pdfjsLib) return fail();
        clearTimeout(timer);
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER;
        resolve(window.pdfjsLib);
      };
      script.onerror = fail;
      document.head.appendChild(script);
    }).catch((error) => {
      pdfLibraryPromise = undefined;
      throw error;
    });
  }
  return pdfLibraryPromise;
}

export async function extractTextFromPDF(file) {
  const library = await loadPdfLibrary();
  const data = new Uint8Array(await file.arrayBuffer());
  const task = library.getDocument({ data });
  try {
    const pdf = await task.promise;
    const pages = [];
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const page = await pdf.getPage(number);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str || "").join(" "));
    }
    const text = pages.join("\n").trim();
    if (!text) throw new Error("This PDF has no readable text. Please upload a text-based PDF instead of a scan.");
    return text;
  } finally {
    await task.destroy();
  }
}
