import { SequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as  dotenv from 'dotenv'
dotenv.config()

const llm = new OpenAI({ temperature: 0 });
const template =
  `您是街頭美食評論家。 鑑於日式料理的簡介，您的工作就是為該道日式料理撰寫評論。
 
  標題：{title}
  特色: {typical}
  簡介：這是上述日式料理簡介:`;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title", "typical"],
});
const synopsisChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "synopsis",
});

const reviewLLM = new OpenAI({ temperature: 0 });
const reviewTemplate = `您是街頭美食評論家。 鑑於日式料理的簡介，您的工作就是為該道日式料理撰寫評論。
 
日式料理簡介：
  {synopsis}
《街頭美食評論家》評論人對上述料理的評價：`;
const reviewPromptTemplate = new PromptTemplate({
  template: reviewTemplate,
  inputVariables: ["synopsis"],
});
const reviewChain = new LLMChain({
  llm: reviewLLM,
  prompt: reviewPromptTemplate,
  outputKey: "review",
});

const overallChain = new SequentialChain({
  chains: [synopsisChain, reviewChain],
  inputVariables: ["typical", "title"],
  // Here we return multiple variables
  outputVariables: ["synopsis", "review"],
  // verbose: true,
});
const chainExecutionResult = await overallChain.call({
  title: "醋飯",
  typical: "魚好吃",
});
console.log(chainExecutionResult);

// {
//   synopsis:  '醋飯是一道日式料理中不可或缺的重要食材，它是由米飯和醋混合而成的。醋飯的特色在於它的酸甜口感，能夠為其他食材帶來豐富的層次感。而在日式料理中，
// 醋飯最常搭配的就是新鮮的生魚片，這樣的搭配能夠讓魚的鮮甜味更加突出，讓人一口接一口。醋飯也可以搭配其他的食材，如海鮮、蔬菜等，都能夠帶來不同的美味
// 體驗。',
//   review: '作為一位街頭美食評論家，我對日式料理中的醋飯有著深刻的印象。這道料理的簡單卻又不失美味，讓我每次吃到都感到滿足。醋飯的酸甜口感非常適合搭配生魚
// 片，讓魚的鮮甜味更加突出，讓人一口接一口。除了生魚片，醋飯也可以搭配其他的食材，如海鮮、蔬菜等，都能夠帶來不同的美味體驗。我特別喜歡醋飯的口感，每
// 一口都能感受到米飯和醋的完美平衡，讓人難以忘懷。'
// }
