import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


// const pdfUrl="https://dutiful-mink-70.convex.cloud/api/storage/cc39a6ec-bb9f-4637-a4de-243a72c10d77"
export async function GET(req){
    const reqUrl=req.url;
    const {searchParams}=new URL(reqUrl);
    const pdfUrl=searchParams.get('pdfUrl');
    const fileId = searchParams.get('fileId'); // Get fileId from query params

    console.log(pdfUrl);
    //1 . Load the pdf file
    const response=await fetch(pdfUrl);
    const data=await response.blob();
    const loader=new WebPDFLoader(data);
    const docs=await loader.load();

    let pdfTextContent='';
    docs.forEach(doc=>{
        pdfTextContent=pdfTextContent+doc.pageContent;
    })

    //2. Split the text in to the small chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
      });

      const output = await splitter.createDocuments([pdfTextContent]);

      const splitterList = output.map(doc => ({
        pageContent: doc.pageContent,
        metadata: { fileId },
    }));



    return NextResponse.json({result:splitterList})
}