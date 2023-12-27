import { ChatOpenAI } from "langchain/chat_models/openai";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import {
    RunnableLambda,
    RunnableMap,
    RunnablePassthrough,
} from "langchain/runnables";
import { StringOutputParser } from "langchain/schema/output_parser";
import { HNSWLib } from "langchain/vectorstores/hnswlib";//vector db
import * as  dotenv from 'dotenv'
dotenv.config()

async function main() {

    const vectorStore = await HNSWLib.fromDocuments(
        [
            new Document({ pageContent: "第1條,本細則依檔案法（以下簡稱本法）第二十九條規定訂定之。" }),
            new Document({ pageContent: "第2條第1項,本法第二條第二款所稱管理程序，指依文書處理或機關業務相關法令規定，完成核定、發文或辦結之程序。" }),
            new Document({ pageContent: "第2條第2項,本法第二條第二款所稱文字或非文字資料及其附件，指各機關處理公務或因公務而產生之各類紀錄資料及其附件，包括各機關所持有或保管之文書、圖片、紀錄、照片、錄影（音）、微縮片、電腦處理資料等，可供聽、讀、閱覽或藉助科技得以閱覽或理解之文書或物品。" }),
            new Document({ pageContent: "第3條,各機關管理檔案，應依本法第四條規定，並參照檔案中央主管機關訂定之機關檔案管理單位及人員配置基準，設置或指定專責單位或人員。" }),
            new Document({ pageContent: "第4條第1項,各機關依本法第五條規定，經該管機關核准，將檔案運往國外者，應先以微縮、電子或其他方式儲存，並經管理該檔案機關首長核定。" }),
            new Document({ pageContent: "第4條第2項,前項檔案如屬永久保存之機關檔案，並應經檔案中央主管機關同意。" }),
            new Document({ pageContent: "第5條,各機關依本法第六條第二項規定，將檔案中之器物交有關機構保管時，應訂定書面契約或作成紀錄存查。" }),
        ], new OpenAIEmbeddings()
    );

    const retriever = vectorStore.asRetriever(1);

    const prompt = ChatPromptTemplate.fromMessages([
        [
            "ai",
            `Answer the question based on only the following context:

    {context}`,
        ],
        ["human", "{question}"],
    ]);
    const model = new ChatOpenAI();
    const outputParser = new StringOutputParser();

    const setupAndRetrieval = RunnableMap.from({
        context: new RunnableLambda({
            func: (input) =>
                retriever.invoke(input).then((response) => response[0].pageContent),
        }).withConfig({ runName: "contextRetriever" }),
        question: new RunnablePassthrough(),
    });
    const chain = setupAndRetrieval.pipe(prompt).pipe(model).pipe(outputParser);

    const response = await chain.invoke("公開資料的機關檔案可以做為公開資料嗎?");
    console.log(response);
    /**
    根據提供的上下文，無法確定永久保存的機關檔案是否可以作為公開資料。
    第4條第2項只提到檔案需要經過檔案中央主管機關同意，但並未明確指出是否可以公開。因此，要確定機關檔案是否可以作為公開資料，還需要參考其他相關法律或條例。
     */
}
main()