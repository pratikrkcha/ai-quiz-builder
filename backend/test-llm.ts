import { generateQuestions } from './src/services/llmService';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  console.log("Testing Gemini API...");
  try {
    const questions = await generateQuestions('JavaScript', 5);
    console.log("SUCCESS:");
    console.log(JSON.stringify(questions, null, 2));
  } catch (err) {
    console.error("FAILED:", err);
  }
}
run();
