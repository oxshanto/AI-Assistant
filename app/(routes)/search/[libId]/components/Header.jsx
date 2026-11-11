'use client'

import { UserButton } from '@clerk/nextjs'
import { Clock } from 'lucide-react'
import React from 'react'
import moment from "moment";

function Header({searchInputRecord}) {
return (<div className='sticky top-0 z-50 bg-white p-4 border-b flex justify-between items-center'> <div className='flex gap-2 items-center relative'> <UserButton /> <div className='flex gap-1 items-center'> <Clock className='h-5 w-5 text-gray-500'/> <h2 className='text-sm text-gray-500'>
{moment(searchInputRecord?.created_at).fromNow()} </h2> </div> </div> </div>
)
}

export default Header;
