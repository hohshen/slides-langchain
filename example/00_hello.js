import { OpenAI } from "langchain/llms/openai";
import * as  dotenv from 'dotenv'
dotenv.config()

const model = new OpenAI({
    temperature: 0.9
})
const res = await model.call("請問該如何有效率的學習大語言模型LLM?")
console.log(res)

// 1. 理解大語言模型的概念與作用：大語言模型（LLM）是一種基於統計學和機器學習的自然語言處理技術，用於自動理解、
// 生成和分析人類語言。學習LLM之前，需要先了解其背後的理論基礎和應用領域，以及其在現實生活中的應用價值。
// 2. 選擇合適的學習資源：目前市面上有許多關於LLM的學習資源，如線上課程、書籍、網絡文章和視頻。可以根據自己的需
// 求和學習風格選擇適合自己的學習資源