const express = require("express");
const dotenv = require("dotenv");
const { createOpenAI } = require("@ai-sdk/openai");
const { generateText } = require("ai");

dotenv.config(); // Load environment variables
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
});

const main = async (question,context) => {
  const text = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `##context##:${context}
    
    ##answer this question based on the context above##: ${question}`,
  });
  return text;
};

const router = express.Router();

router.get("/", async (req, res) => {
  const { question, context } = req.query; // Use query parameters for GET

  try {
    const answer = await main(question, context);
    res.json({ response: answer.responseMessages[0].content[0].text });
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;
