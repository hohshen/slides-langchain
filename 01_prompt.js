import { OpenAI } from "langchain/llms/openai";
import * as  dotenv from 'dotenv'
dotenv.config()

const model = new OpenAI({
    temperature: 0.9
})
const res = await model.call(`
請寫一篇facebook貼文，主題是
"""
什麼人適合學習大型語言模型(LLM) 
"""
貼文內容請滿足以下條件
1.500個字左右
2.不需要名詞解釋
3.請舉例說明
4.可以加入emoji符號
`)
console.log(res)