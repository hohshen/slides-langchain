import axios from 'axios'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from 'langchain/chains'
import { AIMessage, HumanMessage } from 'langchain/schema';
import fs from 'fs'

import * as  dotenv from 'dotenv'
dotenv.config()

function toBase64(filePath) {
    const img = fs.readFileSync(filePath);
    return Buffer.from(img).toString('base64');
}
async function ocrImage(path) {
    const chain = new ChatOpenAI({
        modelName: "gpt-4-vision-preview",
        maxTokens: 1024,
    });
    const msg = await chain.invoke([
        new AIMessage("你是一個對於OCR圖片非常在行的bot"),
        new HumanMessage({
            content: [
                { type: "text", text: "請辨識出圖片中所有食物" },
                { type: "image_url", image_url: { url: `data:image/png;base64,${toBase64(path)}` }, }
            ]
        })
    ])
    return msg.content

    // 圖片中包含以下食物：
    // 1. 一整打的雞蛋（看起來是在蛋盒裡）。
    // 2. 奶酪，看上去像是某種圓形的白色奶酪。
    // 3. 一袋紅色的迷你番茄。
    // 4. 兩根綠色的西葫蘆（又稱意大利瓜）。
    // 5. 一袋包裝好的食品，雖然看不清楚標籤，但似乎是橄欖。
    // 由於圖片中的文字不清晰，我無法提供特定品牌或食品的細節。
}

async function genDish(food) {
    const template = `
    根據以下物品清單
    {food}
    僅使用這些原料製作多道菜餚並說出它的名稱。
    不要加上任何解釋或分析,只需要名稱,中間使用、隔開,不需要換行

    Example:
    比薩、壽司

    Output:
    `
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        maxTokens: 1024,
    });
    const promptTemplate = new PromptTemplate({
        template: template,
        inputVariables: ["food"]
    })
    const chain = new LLMChain({ llm: model, prompt: promptTemplate })
    const res = await chain.call({ food: food })
    return res.text
    // '炒蛋、奶酪三明治、番茄沙拉、炒西葫蘆、橄欖沙拉'
    return dish
}

async function genImage(dish) {
    const opt = {
        method: 'POST',
        url: "https://api.openai.com/v1/images/generations",
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        data: {
            "model": "dall-e-3",
            "prompt": `兩人的燭光晚餐, 桌上有${dish}這些餐點`,
            "n": 1,
            "size": "1024x1024"
        },
    };
    const { data } = await axios(opt);
    // {
    //     created: 1703694725,
    //     data: [{
    //         revised_prompt: 'A candlelight dinner scene with two people. The table is laden with a harmonious blend of dishes. It includes scrumptious scrambled eggs, flavorful cheese sandwiches, a vibrant tomato salad, stir-fried zucchini glistening with appealing spices, and a refreshing olive salad. The gentle glow of the candles casts a warm, intimate light over the food and companions.',
    //         url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-hi3aC4zJraunss4nAh5h2Mq1/user-nXUZ4kPEhLu9Id6He0KZtWGb/img-YenJqFlt006NmampWAHEMimK.png?st=2023-12-27T15%3A32%3A05Z&se=2023-12-27T17%3A32%3A05Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-26T23%3A41%3A04Z&ske=2023-12-27T23%3A41%3A04Z&sks=b&skv=2021-08-06&sig=IkVXggow59aFRmChp8mdi5g944zDdGrYnDWr/xVP7JQ%3D'
    //     }]
    // }
    return data.data[0].url
}
async function main() {
    const path = './image.png'
    const food = await ocrImage(path);
    const dish = await genDish(food);
    const img = await genImage(dish);
    console.log(img)
}
main()

// {
//   created: 1703694725,
//   data: [{
//       revised_prompt: 'A candlelight dinner scene with two people. The table is laden with a harmonious blend of dishes. It includes scrumptious scrambled eggs, flavorful cheese sandwiches, a vibrant tomato salad, stir-fried zucchini glistening with appealing spices, and a refreshing olive salad. The gentle glow of the candles casts a warm, intimate light over the food and companions.',
//       url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-hi3aC4zJraunss4nAh5h2Mq1/user-nXUZ4kPEhLu9Id6He0KZtWGb/img-YenJqFlt006NmampWAHEMimK.png?st=2023-12-27T15%3A32%3A05Z&se=2023-12-27T17%3A32%3A05Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-26T23%3A41%3A04Z&ske=2023-12-27T23%3A41%3A04Z&sks=b&skv=2021-08-06&sig=IkVXggow59aFRmChp8mdi5g944zDdGrYnDWr/xVP7JQ%3D'
//   }]
// } 