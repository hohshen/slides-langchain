import * as  dotenv from 'dotenv'
import fs from 'fs'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage } from 'langchain/schema';

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

//https://www.youtube.com/watch?v=IZGBshGqB3g 3:43
console.log(msg)