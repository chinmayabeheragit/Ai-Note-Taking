import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string(),
  },
  handler: async (ctx,args) => {
    await ConvexVectorStore.fromTexts(
        args.splitText,//array
      args.fileId//string
      [{ prop: 2 }, { prop: 1 }, { prop: 3 }],
      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyBWUTQFkA8SAbNVjh-bm4p6dPSiyNhiweY',
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
      
    );
    return 'completed';
  },
});

export const search = action({
    args: {
      query: v.string(),
      fileId:v.string(),
    },
    handler: async (ctx, args) => {
      const vectorStore = new ConvexVectorStore(      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyBWUTQFkA8SAbNVjh-bm4p6dPSiyNhiweY',
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }), { ctx });
  
      const resultOne = (await vectorStore.similaritySearch(args.query, 1)).filter(q=>q.metadata.fileId==args.fileId);
      console.log(resultOne);
      return JSON.stringify(resultOne);
    },
  });
