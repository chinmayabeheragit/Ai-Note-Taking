import { chatSession } from '@/config/AIModel';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation } from 'convex/react';
import { Bold, Highlighter, Italic, Sparkles } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner';

function EditorExtension({ editor }) {
    const {fileId}=useParams();
    const SearchAI = useAction(api.myAction.search)
    const saveNotes=useMutation(api.notes.AddNotes);
    const {user} = useUser();




const onAiClick=async()=>{
    toast("Ai is getting your answer.")

    const selectedText=editor.state.doc.textBetween(
       editor.state.selection.from,
       editor.state.selection.to,
       ' '
    );
    console.log("selectedText",selectedText);

    const result = await SearchAI ({
        query:selectedText,
        fileId:fileId
    })

    const UnformattedAns=JSON.parse(result);
    let AllUnformatedAns='';
    UnformattedAns&&UnformattedAns.forEach(item => {
        AllUnformatedAns=AllUnformatedAns+item.pageContent
    });

    const PROMPT="For question:"+selectedText+" and with the given content as answer,"+"please give appropriate answer content is:"+AllUnformatedAns;

    const AiModelResult=await chatSession.sendMessage(PROMPT);

    console.log(AiModelResult.response.text());
    const FinalAns= AiModelResult.response.text().replace('```','').replace('html','').replace('```','');

    const AllText=editor.getHTML();
    editor.commands.setContent(AllText+'<p> <strong>: </strong>'+FinalAns+'</p>');

    saveNotes({
        notes:editor.getHTML(),
        fileId:fileId,
        createdBy:user?.primaryEmailAddress?.emailAddress
    })

}


    return editor && (
        <div className='p-5 '>
            <div className="control-group">
                <div className="button-group flex gap-3">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'text-blue-500' : ''}
                    >
                        <Bold />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'text-blue-500' : ''}
                    >
                        <Italic />
                    </button>
                    <button                         
                    onClick={() => onAiClick()}
                    className={'hover:text-blue-500'}
                    >
                        <Sparkles/>

                    </button>

                </div>
            </div>
        </div>
    )
}

export default EditorExtension