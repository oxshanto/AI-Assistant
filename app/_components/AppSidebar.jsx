"use client";
import { usePathname } from "next/navigation";
import React from 'react';
import Image from "next/image";
import { SignOutButton, SignUpButton, UserButton,useUser } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Compass, GalleryHorizontalEnd, Home, LogIn, Search } from 'lucide-react';
const MenuOptions=[
  { 
  title :'Home',
  icon:Home,
  path:'/'
},
{ 
  title :'Discover',
  icon:Compass,
  path:'/Discover'
},
{ 
  title :'Library',
  icon:GalleryHorizontalEnd,
  path:'/Library'
},


]

function AppSidebar() {
  const path=usePathname();
  const {user}=useUser();
  return (
    <Sidebar className="!bg-[#E2D7D5] !text-slate-900 !pt-0 !mt-0">


     <SidebarHeader className="!p-0 !m-0 bg-slate-950 text-white">
  <div className="px-4 pt-2 pb-3">
    <h1 className="text-2xl font-bold tracking-wide">
      <span className="text-blue-400">AI</span> Assistant
    </h1>

    <p className="text-xs text-gray-400 mt-1">
      Your Intelligent Companion
    </p>
  </div>
</SidebarHeader>

      <SidebarContent className="!bg-[#E2D7D5] !text-slate-900 !pt-0 !mt-0">
        <SidebarGroup>
        <SidebarContent>
          <SidebarMenu>
          {MenuOptions.map((menu,index)=>(
                <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild className={`p-5 py-6 hover:bg-transparent hover:font-bold
             ${path?.includes(menu.path)&& 'font-italic'}`}>
              <a href={menu.path} className=''>
                <menu.icon/>
                <span>{menu.title}

                </span>
              </a>
            </SidebarMenuButton>
             </SidebarMenuItem>
          ))}  
          </SidebarMenu>
         {!user? <SignUpButton mode='modal'>
          <button className="rounded-full mx-4 mt-4 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition">
  Sign Up
</button>
</SignUpButton>:
<SignOutButton>
   <button className="rounded-full mx-4 mt-4 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition">
  LogOut
</button>
</SignOutButton>}

        </SidebarContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
  <div className='p-3 flex flex-col'>
    <UserButton/>
  </div>
      </SidebarFooter>

    </Sidebar>
  );
}

export default AppSidebar;