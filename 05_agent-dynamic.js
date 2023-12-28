import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { DynamicTool } from "langchain/tools";

import * as  dotenv from 'dotenv'
dotenv.config()

const model = new OpenAI({
    temperature: 0.9
})

const tools = [
    new DynamicTool({
        name: "Toolsの誘惑",
        description: "取得今天的日期與時間",
        func: async () => new Date().toISOString(),
    }),
]

const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    verbose: true// show step by step
})
const res = await executor.call({
    input: "請問日期?"
})
console.log(res)

// const res = await model.call("請問52.78^2為多少?")
// 回 2781.8084, 正確是2785.7284
// console.log(res)
