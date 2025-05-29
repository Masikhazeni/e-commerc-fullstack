import React, { useState } from 'react'
import Information from './Information'
import Edit from './Edit'
export default function Profile() {
  const [pageType,setPageType]=useState('information')
  const handlePageType=()=>setPageType(pageType=='information'?'edit':'information')

  return (
    <>
      {pageType=='information'?<Information handlePageType={handlePageType}/>:<Edit handlePageType={handlePageType}/>}
    </>
  )
}