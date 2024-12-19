"use server";
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");

const geminikey = process.env.GEMINI;
if (!geminikey) {
  throw new Error("Gemini API key is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI({ apiKey: geminikey });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Function to extract text and metadata from a PDF
async function extractTextAndMetadataFromPDF(pdfFile: any) {
  const data = await pdfParse(pdfFile);
  const extractedText = data.text;
  const metadata = {
    title: data.info.Title || "Unknown",
    author: data.info.Author || "Unknown",
    subject: data.info.Subject || "Unknown",
    creationDate: data.info.CreationDate || "Unknown",
    modificationDate: data.info.ModDate || "Unknown",
  };
  return { extractedText, metadata };
}

// Function to analyze document for tampering
export async function analyzeDocument(pdfFile: Buffer) {
  console.log("Analyzing document for tampering...");

  // Extract text and metadata from the PDF
  const { extractedText, metadata } = await extractTextAndMetadataFromPDF(pdfFile);

  // Analysis prompt for Gemini AI
  const prompt = `Analyze the following document text for potential tampering and validate its metadata:
  
Document Text: "${extractedText.slice(0, 500)}"  // First 500 chars for context

Metadata: ${JSON.stringify(metadata)}

Provide a detailed analysis including:
1. Signs of tampering (e.g., inconsistencies in text, missing signatures).
2. Validation of metadata (e.g., dates, names, stamps).
3. Overall authenticity score (on a scale of 1 to 10).`;

  const MAX_RETRIES = 3; // Maximum number of retries
  const RETRY_DELAY = 3000; // Delay between retries in milliseconds

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}: Sending request to Gemini...`);

      // Call the Gemini API
      const result = await model.generateMessage({
        prompt: { text: prompt },
      });

      // Check if the result is valid
      if (result && result.candidates && result.candidates.length > 0) {
        return result.candidates[0].output;
      } else {
        throw new Error("Empty response from Gemini");
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt === MAX_RETRIES - 1) {
        throw new Error("Max retries reached. Unable to analyze document.");
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}
