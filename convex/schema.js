import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { use } from "react";

export default defineSchema ({
    users:defineTable({
        username:v.string(),
        email:v.string(),
        imageUrl:v.string(),
        upgrade:v.number()
    }),
    pdfFiles:defineTable({
        fileId:v.string(),
        storageId:v.string(),
        fileName:v.string(),
        fileUrl:v.string(),
        createdBy:v.string(),
    }),
    documents: defineTable({
        embedding: v.array(v.number()),
        text: v.string(),
        metadata: v.any(),
      }).vectorIndex("byEmbedding", {
        vectorField: "embedding",
        dimensions: 768,
      }),

      notes:defineTable({
        fileId:v.string(),
        notes:v.any(),
        createdBy:v.string()

      })

})