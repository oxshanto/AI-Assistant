"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabase";
import {v4 as uuidv4} from'uuid';
import {useRouter} from 'next/navigation'
import {
  Atom,
  Cpu,
  Globe,
  Paperclip,
  Mic,
  AudioLines,
  SearchCheck,
   ArrowRight
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

function Chatbox() {
    const[userSearchInput,setUserSearchInput]=useState();
    const[seachType,setSearchType]=useState('search');
    const{user}=useUser();

    const [loading,setLoading]=useState(false);

    const router=useRouter();
    const onSearchQuery=async()=>{
         setLoading(true);
        const libId=uuidv4();
        const data=await supabase.from ('Library').insert([
            {
               searchInput: userSearchInput,
               userEmail:user?.primaryEmailAddress?.emailAddress,
               type:seachType,
               libId:libId
            }
        ]).select();
        setLoading(false);
        //redirect to new screen
        router.push('/search/'+libId)
       console.log(data[0]);
    }
  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">

        <span className="text-5xl text-teal-700">
          ✳
        </span>

        <h1 className="text-3xl font-semibold text-gray-900">
          AI Assistant
        </h1>

      </div>

      {/* Chatbox Container */}
      <div className="w-full max-w-2xl">

        <div className="w-full border border-gray-300 rounded-2xl p-4 shadow-sm bg-white">

          {/* Tabs */}
          <Tabs defaultValue="search" className="w-full">

            {/* Search Input */}
            <TabsContent value="search" className="mt-0 mb-4">

              <input
                type="text"
                placeholder="Ask Anything"
                onChange={(e)=>setUserSearchInput(e.target.value)}
                className="w-full h-16 px-3 text-base outline-none border-b border-gray-200"
              />

            </TabsContent>

            {/* Research Input */}
            <TabsContent value="research" className="mt-0 mb-4">

              <input
                type="text"
                placeholder="Research Anything"
           onChange={(e) => setUserSearchInput(e.target.value)}
                className="w-full h-16 px-3 text-base outline-none border-b border-gray-200"
              />

            </TabsContent>

            {/* Bottom Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">

              {/* Left Side */}
              <TabsList className="grid grid-cols-2 w-fit">

                <TabsTrigger value="search" className="gap-2" onClick={()=>setSearchType('search')}>
                  <SearchCheck className="h-4 w-4" />
                  Search
                </TabsTrigger>

                <TabsTrigger value="research" className="gap-2" onClick={()=>setSearchType('research')}>
                  <Atom className="h-4 w-4" />
                  Research
                </TabsTrigger>

              </TabsList>

              {/* Right Side */}
              <div className="flex items-center gap-1">

                <Button variant="ghost" size="icon">
                  <Cpu className="h-4 w-4 text-gray-500" />
                </Button>

                <Button variant="ghost" size="icon">
                  <Globe className="h-4 w-4 text-gray-500" />
                </Button>

                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                </Button>

                <Button variant="ghost" size="icon">
                  <Mic className="h-4 w-4 text-gray-500" />
                </Button>

                <Button size="icon" className="rounded-xl bg-black" onClick={()=>{
                    userSearchInput?onSearchQuery():null
                }}>
                 {!userSearchInput?<AudioLines className="h-4 w-4 text-white" />
               :<ArrowRight className="h-4 w-4 text-white"disabled={loading} />}
               </Button>

              </div>

            </div>

          </Tabs>

        </div>

      </div>

    </main>
  );
}

export default Chatbox;