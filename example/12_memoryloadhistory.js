import { ChatOpenAI } from "langchain/chat_models/openai";

import { BufferMemory } from 'langchain/memory'
import { ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { HumanMessage, AIMessage } from "langchain/schema";
import * as  dotenv from 'dotenv'
dotenv.config()


const pastMessages = [
    new HumanMessage("My name's Hohshen"),
    new AIMessage("Hi! Hohshen."),
];
const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(pastMessages),
});

const model = new ChatOpenAI({ temperature: 0.9 })
const chain = new ConversationChain({
    llm: model,
    memory: memory
})

const res1 = await chain.call({ input: "I living in Taiwan" })
console.log(res1)
const res2 = await chain.call({ input: "what is my name? Where do I live?" })
console.log(res2)
console.log(await memory.chatHistory.getMessages());
//{ response: 'Your name is Hohshen and you live in Taiwan.' }