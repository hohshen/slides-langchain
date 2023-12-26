import {OpenAI} from "langchain/llms/openai";
import * as  dotenv from 'dotenv'
dotenv.config()

const model=new OpenAI({
    temperature:0.9
})
const res=await model.call("股利超過多少要扣稅")
console.log(res)