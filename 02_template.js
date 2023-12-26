import {OpenAI} from "langchain/llms/openai";
import {PromptTemplate} from "langchain/prompts";
import {LLMChain} from 'langchain/chains'
import * as  dotenv from 'dotenv'
dotenv.config()

const template="在台灣, {income}超過多少要扣稅?"
const promptTemplate=new PromptTemplate({
    template:template,
    inputVariables:["income"]
})
// const formattedPrompt=await promptTemplate.format({
//     income:'境外所得'
// })
// console.log(formattedPrompt)

const model=new OpenAI({
    temperature:0.9
})
const chain=new LLMChain({llm:model,prompt:promptTemplate})
const res=await chain.call({income:"境外所得"})
console.log(res)
// {  text: '\n' +  '\n' +  '在台灣，個人所得稅的課稅標準是依據年度所得金額計算，並按照不同級距徵收稅率。一般而言，年度所得金額超過120萬元以上即需要繳納個人所得稅。具體的稅率和級距可以參考經濟部國家稅務局的相關規定。'}