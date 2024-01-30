import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as  dotenv from 'dotenv'
dotenv.config()

const llm = new OpenAI({ temperature: 0 });
const template = `你是一位日式料理店廚師。 給定一道日式料理，你的工作就是為該料理寫一個簡介。
 
  標題： {title}
  簡介：這是上述日式料理簡介:`;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title"],
});
const synopsisChain = new LLMChain({ llm, prompt: promptTemplate });

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
});

const overallChain = new SimpleSequentialChain({
  chains: [synopsisChain, reviewChain],
  verbose: true,
});
const review = await overallChain.run("醋飯");
console.log(review);

// 作為一位街頭美食評論家，我對這道日式料理-醋飯的評價是非常高的。首先，它的製作過程非常精密，需要精確的比例和
// 技巧，這讓我對這道料理的專業程度有了更深的認識。其次，醋飯的酸甜口感和柔軟的質地讓我印象深刻，它能夠與各種配
// 料完美搭配，讓每一口都能夠保持均衡的味道。最重要的是，作為一道傳統的日式料理，醋飯展現了日本料理的精髓，讓人
// 感受到日本文化的獨特魅力。
