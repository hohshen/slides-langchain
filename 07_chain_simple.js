import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as  dotenv from 'dotenv'
dotenv.config()
//一個輸入,對應上一個輸出

// This is an LLMChain to write a synopsis given a title of a play.
const llm = new OpenAI({ temperature: 0 });
const template = `你是一位劇作家。 給定劇作的標題，你的工作就是為該標題寫一個概要。
 
  標題： {title}
  編劇：這是上述戲劇的劇情簡介:`;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title"],
});
const synopsisChain = new LLMChain({ llm, prompt: promptTemplate });

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
});

const overallChain = new SimpleSequentialChain({
  chains: [synopsisChain, reviewChain],
  // verbose: true,
});
const review = await overallChain.run("海灘日落時的悲劇");
console.log(review);
/**
 * 這部戲劇充滿了強烈的情感和令人難忘的場景。
 * 導演巧妙地將浪漫的氛圍與暴力的現實交織在一起，讓觀眾在感受愛情的美好同時也深刻反思暴力的可怕。
 * 演員們的表演也非常出色，特別是在悲傷和仇恨的情緒轉換中，他們展現出了令人動容的演技。
 * 劇本也非常精彩，通過細膩的描寫和對社會問題的探討，讓觀眾在劇場裡得到了一次深刻的思想洗禮。
 * 整體而言，這部戲劇是一次令人
 */