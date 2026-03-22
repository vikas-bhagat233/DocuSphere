const { GoogleGenerativeAI } = require("@google/generative-ai");
const Document = require('../models/Document');

exports.chatWithDocuBot = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API Key is missing on the server!" });
    }

    // Fetch user's documents to give Gemini context about their vault!
    const userDocs = await Document.find({ userId: req.user, isDeleted: false }).select('title category tags size createdAt');
    const vaultContext = userDocs.map(d => `- ${d.title} (Category: ${d.category}, Tags: ${d.tags.join(', ')})`).join('\n');

    // This is the absolute fix to force 'v1' instead of 'v1beta'
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1" });
    
    const systematicPrompt = `
      You are DocuBot, a highly intelligent, witty, and premium AI assistant built into the DocuSphere platform. 
      The user asking you this question has a secure document vault with the following files:
      
      ${vaultContext || "Their vault is currently empty."}
      
      Using this context of what files they own, answer their question helpfully, concisely, and professionally using Markdown formatting.
      
      User's question: "${prompt}"
    `;

    let result;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      result = await model.generateContent(systematicPrompt);
    } catch (e) {
      console.warn("Gemini 1.5 Flash failed, falling back to gemini-pro...", e.message);
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      result = await fallbackModel.generateContent(systematicPrompt);
    }

    const text = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
