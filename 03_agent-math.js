import { OpenAI } from "langchain/llms/openai";
import { SerpAPI } from "langchain/tools"
import { Calculator } from "langchain/tools/calculator"
import { initializeAgentExecutorWithOptions } from 'langchain/agents'

// import * as  dotenv from 'dotenv'
// dotenv.config()

const model = new OpenAI({
    temperature: 0.9
})
const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
        hl: 'zh-tw',//Language https://serpapi.com/google-languages
        gl: 'tw'//Country https://serpapi.com/google-countries
    }),
    new Calculator()
]
const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    verbose: true// show step by step
})

const res = await executor.call({
    input: "請問2023/12/31日,台北的天氣如何? 攝氏氣溫最大與最小值幾度? 攝氏氣溫最小值^2為多少? 請使用正體中文回答"
})
console.log(res)
/**
 * { output: '2023/12/31的台北天氣預報為晴朗偶有雲，攝氏氣溫最大為22度，最小為12度，最小值的平方為144。' }
 */