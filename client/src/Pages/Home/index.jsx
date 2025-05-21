import React from 'react'
import MainSlider from './MainSlider'
import MainSection from './MainSection'
import BrowseByCategory from './BrowsByCaregory'
import NewestProducts from './NewestProducts'
import DiscountPoster from './DiscountPoster'
import ThemostDiscount from './ThemostDiscount'

export default function Home() {
  return (
    <>
    <MainSlider/>
    <DiscountPoster/>
    <MainSection/>
    <BrowseByCategory/>
    <ThemostDiscount/>
    <NewestProducts/>
      
    </>
  )
}
