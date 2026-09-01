import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fileName = body.fileName?.toLowerCase();
    const fileData = body.fileData;

    if (!fileName || !fileData) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(fileData, 'base64');
    let extractedText = "";

    if (fileName.endsWith(".pdf")) {
      const PDFParser = require("pdf2json");
      const pdfParser = new PDFParser(null, 1);
      
      extractedText = await new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
          resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
      });
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (fileName.endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json({ success: false, error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." }, { status: 400 });
    }

    // Clean up excessive whitespace
    extractedText = extractedText.replace(/\s+/g, ' ').trim();

    // If text is too long (e.g. > 15,000 chars), truncate it to avoid hitting token limits
    // in our basic AI implementation to save API tokens and prevent errors.
    if (extractedText.length > 5000) {
      extractedText = extractedText.substring(0, 5000) + "\n... [Document truncated to save API limits. Please ask specific questions about the beginning of the document or upload a smaller file.]";
    }

    if (!extractedText) {
      return NextResponse.json({ success: false, error: "Could not extract text from document. It might be empty or scanned." }, { status: 400 });
    }

    return NextResponse.json({ success: true, text: extractedText });
  } catch (error: any) {
    console.error("Document parsing error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: "Failed to parse document: " + msg }, { status: 500 });
  }
}
