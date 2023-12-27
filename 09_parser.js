import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import * as  dotenv from 'dotenv'
dotenv.config()

const parser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: "answer to the user's question",
    source: "source used to answer the user's question, should be a website.",
});
const formatInstructions = parser.getFormatInstructions()
const prompt = new PromptTemplate(
    {   //在template中告知要parser成什麼樣子
        template: "Answer the users question as best as possible.\n{format_instructions}\n{question}",
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