
"use client"
import React, {use, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react';
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
// import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { Toaster } from 'sonner'
  


function UploadPdfDialog({children}) {

    const generateUploadUrl=useMutation(api.storage.generateUploadUrl);
    const addFileEntry=useMutation(api.storage.AddFileEntry);
    const getFileUrl=useMutation(api.storage.getFileUrl);
    const embeddDocument=useAction(api.myAction.ingest);
    const {user}=useUser();
    const [file,setFile]=useState();
    const [loading,setLoading]=useState(false);
    const [fileName,setFileName] = useState()
    const [open,setOpen]=useState(false)
    const [uploadedFilesCount, setUploadedFilesCount] = useState(0);



    const OnFileSelect=(event)=>{
        setFile(event.target.files[0]);

    }

    const OnUpload=async()=>{
        setLoading(true);
        try {
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();

      //step 3
      const fileId=uuidv4();
      const fileUrl=await getFileUrl({storageId:storageId})
      await addFileEntry({
        fileId:fileId,
        storageId:storageId,
        fileName:fileName??'Untitled File',
        fileUrl:fileUrl,
        createdBy:user?.primaryEmailAddress?.emailAddress
      })
    //   console.log("response",resp)

      //API Call To Fetch PDF proccess DATA
      const ApiRespone = await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
      console.log(ApiRespone.data.result);
      await embeddDocument({
        splitText:ApiRespone.data.result,
        fileId:fileId

      })
      setUploadedFilesCount((prevCount) => prevCount + 1);
      Toaster('File is Uploaded Successfully');
    } catch (error){
      console.log('error during upload',error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
    };

    const isMaxFile=uploadedFilesCount>=5;
  return (
    <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick={()=>setOpen(true)} disable={isMaxFile} className='w-full'>+ Upload PDF File</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload Pdf File</DialogTitle>
      <DialogDescription asChild>
        <div className=''>
        <h2 className='mt-5'>Select a file to Upload</h2>

            <div className='gap-2 p-3 rounded-md border'>
                <input type='file' accept='application/pdf'
                 onChange={(event) =>OnFileSelect(event)}
                />
                
                
            </div>
            <div className='mt-2'>
                <label>File Name *</label>
                <Input placeholder='File Name'onChange={(e)=>setFileName(e.target.value)} />
            </div>
            <div>
            </div>
        </div>

      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading?
            <Loader2Icon className='animate-spin' />:'Upload'
            }
            
        </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>

  )
}

export default UploadPdfDialog