import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import * as  dotenv from 'dotenv'
dotenv.config()

const parser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: "回答使用者的問題",
    source: "用來回答使用者問題的來源，應該是一個網站網址。",
});
const formatInstructions = parser.getFormatInstructions()
const prompt = new PromptTemplate(
    {   //在template中告知要parser成什麼樣子
        template: "盡可能最好地回答用戶的問題。\n{format_instructions}\n{question}",
        inputVariables: ["question"],
        partialVariables: { format_instructions: formatInstructions }
    }
)

const model = new OpenAI({ temperature: 0 })
const input = await prompt.format({ question: "台灣的首都叫什麼?" })
// console.log(input)

const response = await model.call(input)
// console.log(response)
console.log(await parser.parse(response))
// {
//     answer: '台北',
//     source: 'https://zh.wikipedia.org/wiki/%E5%8F%B0%E5%8C%97'
// }