import { OpenAI } from "langchain/llms/openai";
import { Calculator } from "langchain/tools/calculator"
import { initializeAgentExecutorWithOptions } from 'langchain/agents'

import * as  dotenv from 'dotenv'
dotenv.config()

const model = new OpenAI({
    temperature: 0.9
})
const tools = [
    new Calculator()
]
const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    verbose: true// show step by step
})
const res = await executor.call({
    input: "請問52.78^2為多少?"
})
console.log(res)

// const res = await model.call("請問52.78^2為多少?")
// console.log(res) 回 2781.8084, 但正確是2785.7284
