import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from 'langchain/memory'
import * as  dotenv from 'dotenv'

import { ConversationChain } from "langchain/chains";
dotenv.config()

const model = new OpenAI({
    temperature: 0.9
})
const memory = new BufferMemory()
const chain = new ConversationChain({
    llm: model,
    memory: memory
})


const res1 = await chain.call({ input: "Hi, I'm Hohshen." })
console.log(res1)
const res2 = await chain.call({ input: "What is my name?" })
console.log(res2)
const tmp = await memory.loadMemoryVariables({})
console.log(tmp)
