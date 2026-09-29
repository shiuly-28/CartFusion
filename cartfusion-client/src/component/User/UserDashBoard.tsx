"use client"
import React from 'react'
import Slider from './Slider'
import CategorySlider from './CategorySlider'
import ProductCardPage from './ProductCardPage'
import ShopPage from '@/app/shop/page'

function UserDashBoard() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white font-sans flex-col'>
      <Slider/>
      <CategorySlider/>
      <ProductCardPage/>
      <ShopPage/>
    </div>
  )
}

export default UserDashBoard