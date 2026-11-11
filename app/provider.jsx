'use client'

import React, { createContext,useEffect, useState } from 'react'
export const UserDetailContext = createContext(null);
 import { useUser } from '@clerk/nextjs' 
import { supabase } from '../services/supabase'


function Provider({ children }) {

const { user, isLoaded } = useUser()
const[userDetail,setUserDetail]=useState();

useEffect(() => {

    const CreateNewUser = async () => {

        if (!user) return

        const email = user.primaryEmailAddress?.emailAddress

        if (!email) return

        const { data: users, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', email)

        if (error) {
            console.log('Supabase Error:', error)
            return
        }
     console.log(users)
        if(users.length==0){
            const{data,error}=await supabase
            .from ('Users')
            .insert([
                {
                    name:user?.fullName,
                    email:user?.primaryEmailAddress.emailAddress
                },
            ])
            .select();
            
            setUserDetail(data[0]);
            return;
        }
      setUserDetail(users[0]);
    }

    if (isLoaded && user) {
        CreateNewUser()
    }

}, [isLoaded, user])

return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <div className="w-full">
        {children}
    </div>
    </UserDetailContext.Provider>
)


}

export default Provider