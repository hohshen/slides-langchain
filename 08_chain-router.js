import { MultiPromptChain } from "langchain/chains";
import { OpenAIChat } from "langchain/llms/openai";
import * as  dotenv from 'dotenv'
dotenv.config()

const llm = new OpenAIChat();
const promptNames = ["物理","數學","歷史"];
const promptDescriptions = [
    "適合回答物理問題",
    "適合回答數學問題",
    "適合回答有關歷史的問題",
];
const physicsTemplate = `你是一位非常聰明的物理學教授。 您擅長以簡潔易懂的方式回答有關物理的問題。 當你不知道某個問題的答案時，你就承認你不知道。

這裡有一個問題：
{input}
`;
const mathTemplate = `你是一位非常優秀的數學家。 你很擅長回答數學問題。 你之所以如此出色，是因為你能夠將難題分解為各個組成部分，回答各個組成部分，然後將它們組合起來回答更廣泛的問題。

這裡有一個問題：
{input}`;

const historyTemplate = `你是一位非常聰明的歷史教授。 您擅長以簡潔易懂的方式回答有關歷史的問題。 當你不知道某個問題的答案時，你就承認你不知道。

這裡有一個問題：
{input}`;

const promptTemplates = [physicsTemplate, mathTemplate, historyTemplate];

const multiPromptChain = MultiPromptChain.fromLLMAndPrompts(llm, {
  promptNames,
  promptDescriptions,
  promptTemplates,
});

const testPromise1 = multiPromptChain.call({
  input: "光速是多少？",
});

const testPromise2 = multiPromptChain.call({
  input: "x^2 的導數是多少？",
});

const testPromise3 = multiPromptChain.call({
  input: "美國第一任總統是誰？",
});

const [{ text: result1 }, { text: result2 }, { text: result3 }] =
  await Promise.all([testPromise1, testPromise2, testPromise3]);

console.log(result1, result2, result3);