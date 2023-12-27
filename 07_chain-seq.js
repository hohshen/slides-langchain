import { SequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as  dotenv from 'dotenv'
dotenv.config()
//一個輸入,對應上一個輸出

// This is an LLMChain to write a synopsis given a title of a play and the era it is set in.
const llm = new OpenAI({ temperature: 0 });
const template = 
`你是一位劇作家。 給定劇作的標題，你的工作就是為該標題寫一個概要。
 
  標題： {title}
  時代: {era}
  編劇：這是上述戲劇的劇情簡介:`;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title", "era"],
});
const synopsisChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "synopsis",
});

// This is an LLMChain to write a review of a play given a synopsis.
const reviewLLM = new OpenAI({ temperature: 0 });
const reviewTemplate = `您是《紐約時報》的戲劇評論家。 鑑於戲劇的概要，您的工作就是為該戲劇撰寫評論。
 
播放劇情簡介：
  {synopsis}
《紐約時報》劇評人對上述劇作的評價：`;
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
  inputVariables: ["era", "title"],
  // Here we return multiple variables
  outputVariables: ["synopsis", "review"],
//   verbose: true,
});
const chainExecutionResult = await overallChain.call({
  title: "海灘日落時的悲劇",
  era: "維多利亞時代的英格蘭",
});
console.log(chainExecutionResult);
/*
{
  synopsis: '\n' +
    '\n' +
    '《海灘日落時的悲劇》講述了一個發生在維多利亞時代英格蘭海灘上的悲劇故事。
    主角是一對年輕的戀人，他們在海灘上度過了美好的時光，但命運卻將他們拆散。
    男主角是一位年輕的海軍軍官，被派往遠方執行任務，而女主角則是一位富家千金，被父母安排嫁給一位富商。
    在男主角離開之前，他們在海灘上許下了永遠在一起的誓言。\n' +
    '\n' +
    '然而，命運的捉弄讓他們再次相遇的時候，已經是在海灘日落時分。男主角',
  review: '\n' +
    '\n' +
    '《海灘日落時的悲劇》是一部充滿浪漫情懷的戲劇，故事情節緊湊，情感細膩。
    導演巧妙地將維多利亞時代的風情融入劇中，讓觀眾仿佛置身於那個時代的海灘上。\n' +
    '\n' +
    '男女主角的演技也非常出色，他們將角色的情感表現得淋漓盡致，讓觀眾感同身受。
    尤其是在海灘日落時的重逢場景，兩人的眼神交流和對白讓人動容。\n' +
    '\n' +
    '劇中的配樂也非常精彩，為劇情增添了更多的情感色彩。尤其是在男主角離開海灘的場'
}
*/