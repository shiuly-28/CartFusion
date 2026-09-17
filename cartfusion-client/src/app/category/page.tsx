"use client"
import React, { useState } from 'react'
import { Baby,
     BookOpen,
     Car, 
     Dumbbell, 
     Gift, 
     Home, 
     Shirt,
      ShoppingBasket,
      Smartphone, 
      Sparkles
     } from 'lucide-react'


function CategoriesPage() {

    const [selectedCategory,setSelectedCategory] = useState("all");
    const [selectedShop,setSelectedShop] = useState("all");
    const [search, setSearch] = useState("");
    const [shopSearch, setShopSearch] = useState("");

    const categoryList = [
          { label: "Fashion & LifeStyle", icon: Shirt },
          { label: "Electronics & Gadgets", icon: Smartphone },
          { label: "Home & Living", icon: Home },
          { label: "Beauty & Personal care", icon: Sparkles },
          { label: "Toys, Kids & Baby", icon: Baby },
          { label: "Food & Grocery", icon: ShoppingBasket },
          { label: "Sports & Fitness", icon: Dumbbell },
          { label: "Automotive Accessories", icon: Car },
          { label: "Gift Handcrafts", icon: Gift },
          { label: "Books & Stationery", icon: BookOpen },
    ]
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 
    via-black to-gray-900 text-white py-6 px-4'>
      <div className='max-w-7xl mx-auto mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold'>Browse Products by Categories</h1>
        <p className='text-gray-300 text-sm'>
            Filter by category, shop or search your favorite product
        </p>
      </div>
       <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* left sidebar */}
        <div className='md:col-span-1 bg-white/10 border border-white/20
        rounded-xl p-4 space-y-6'>
            <input type="text" placeholder='Search Product...' 
            className='w-full px-3 py-2 rounded bg-black border border-white/20'
            onChange={(e)=>setSearch(e.target.value)} value={search} />
        </div>
       </div>
    </div>
  )
}

export default CategoriesPage
