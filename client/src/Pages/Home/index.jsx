import React from 'react'
import MainSlider from './MainSlider'
import MainSection from './MainSection'
import BrowseByCategory from './BrowsByCaregory'
import NewestProducts from './NewestProducts'
import DiscountPoster from './DiscountPoster'

export default function Home() {
  return (
    <>
    <MainSlider/>
    <MainSection/>
    <BrowseByCategory/>
    <NewestProducts/>
    <DiscountPoster/>
      
    </>
  )
}
