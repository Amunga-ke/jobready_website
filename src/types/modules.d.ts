declare module "pdfjs-dist/legacy/build/pdf.js" {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): Promise<void>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<{ items: Array<Record<string, unknown>> }>;
  }

  export interface GlobalWorkerOptions {
    workerSrc: string;
  }

  export const GlobalWorkerOptions: GlobalWorkerOptions;

  interface GetDocumentParams {
    data: Uint8Array;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
    isPureFetch?: boolean;
    disableFontFace?: boolean;
    verbosity?: number;
    disableWorker?: boolean;
  }

  export function getDocument(params: GetDocumentParams): { promise: Promise<PDFDocumentProxy> };
}

declare module "pdfjs-dist/legacy/build/pdf.worker.js" {
  const _default: string;
  export default _default;
}

declare module "mammoth" {
  interface ExtractResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }

  interface ExtractOptions {
    buffer: Buffer;
  }

  function extractRawText(options: ExtractOptions): Promise<ExtractResult>;
  export { extractRawText };
}
