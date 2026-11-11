
'use client'
import {useParams} from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { supabase } from "@/services/supabase";
import Header from "./components/Header";
import DisplayResult from './components/DisplayResult';

function SearchQueryResult(){
    const {libId}=useParams();
const [searchInputRecord, setSearchInputRecord] = useState();
    useEffect(()=>{
        getSearchQueryRecord();
    },[])
    const getSearchQueryRecord = async () => {
    const { data: Library, error } = await supabase
        .from('Library')
        .select('*')
        .eq('libId', libId);

    if (error) {
        console.log("Supabase Error:", error);
        return;
    }

    console.log("Library Data:", Library);

    if (!Library || Library.length === 0) {
        console.log("No record found!");
        return;
    }

    setSearchInputRecord(Library[0]);
};
    return(
        <div><Header searchInputRecord={searchInputRecord}/>
        <div className='px-10 md:px-20 lg:px-36 xl:px-56 mt-20 '>
        <DisplayResult searchInputRecord={searchInputRecord}/>
        </div>
     
      </div>
    )
}
export default SearchQueryResult