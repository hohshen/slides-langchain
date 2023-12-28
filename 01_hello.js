import { OpenAI } from "langchain/llms/openai";
import * as  dotenv from 'dotenv'
dotenv.config()

const model = new OpenAI({
    temperature: 0.9
})
const res = await model.call("請問只要不違法就符合社會倫理嗎?")
console.log(res)