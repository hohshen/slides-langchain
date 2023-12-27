//Vector stores https://js.langchain.com/docs/modules/data_connection/vectorstores/#usage
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import * as  dotenv from 'dotenv'
dotenv.config()

const vectorStore = await MemoryVectorStore.fromTexts(
    ["Hello world", "Bye bye", "hello nice world"],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    new OpenAIEmbeddings()
);

const resultOne = await vectorStore.similaritySearch("hello world", 1);
console.log(resultOne);

//[ Document { pageContent: 'Hello world', metadata: { id: 2 } } ] 單純撈出最相近的資料