import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader({fileName}) {
  return (
    <div className='p-4 flex justify-between shadow-md'>
        <Image src={'/logo.svg'} alt='logo' width={140} height={100}>
        
            
        </Image>
        <h2>{fileName}</h2>
        <div className='flex gap-2 items-center'>
          <Button>Save</Button>
        </div>
        <UserButton />
    </div>
  )
}

export default WorkspaceHeader