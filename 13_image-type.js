import fs from 'fs'
import { AIMessage, HumanMessage } from 'langchain/schema';
import { ChatOpenAI } from "langchain/chat_models/openai";
import * as  dotenv from 'dotenv'
dotenv.config()

function toBase64(filePath) {
    const img = fs.readFileSync(filePath);
    return Buffer.from(img).toString('base64');
}

const chain = new ChatOpenAI({
    modelName: "gpt-4-vision-preview",
    maxTokens: 1024,
});
const msg = await chain.invoke([
    new AIMessage("你是一個對於OCR圖片非常在行的bot"),
    new HumanMessage(
        {
            content: [
                {
                    type: "text",
                    text: "請辨識出圖片中所有食物"
                },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:image/png;base64,${toBase64('./image.png')}`
                    },
                }

            ]
        }
    )
])

console.log(msg.content)
// 圖片中包含以下食物：

// 1. 一整打的雞蛋（看起來是在蛋盒裡）。
// 2. 奶酪，看上去像是某種圓形的白色奶酪。
// 3. 一袋紅色的迷你番茄。
// 4. 兩根綠色的西葫蘆（又稱意大利瓜）。
// 5. 一袋包裝好的食品，雖然看不清楚標籤，但似乎是橄欖。

// 由於圖片中的文字不清晰，我無法提供特定品牌或食品的細節。

