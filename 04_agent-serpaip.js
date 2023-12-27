import { OpenAI } from "langchain/llms/openai";
import { SerpAPI } from "langchain/tools"
import { initializeAgentExecutorWithOptions } from 'langchain/agents'

import * as  dotenv from 'dotenv'
dotenv.config()

const model = new OpenAI({
    temperature: 0.9
})
const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
        hl: 'zh-tw',//Language https://serpapi.com/google-languages
        gl: 'tw'//Country https://serpapi.com/google-countries
    }),
]
const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    verbose: true// show step by step
})

const res = await executor.call({
    input: "請使用正體中文回答, 今天台積電收盤股價多少?"
})
console.log(res)
// const res = await model.call("今天台積電收盤股價多少?")
// // 回 514.00, 正確是592 
// console.log(res)
