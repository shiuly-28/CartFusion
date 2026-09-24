/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import React, { useEffect, useState } from 'react'
import { Baby,
     BookOpen,
     Car, 
     Dumbbell, 
     Gift, 
     Home, 
     Shirt,
     ShoppingBasket,
     Smartphone, 
     Sparkles,
     ArrowLeft,
     Search
     } from 'lucide-react'
import axios from 'axios';
import ProductCard from '@/component/ProductCard';
import { useRouter } from 'next/navigation';

function CategoriesPage() {
    const router = useRouter()

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [displayProducts, setDisplayProducts] = useState<any[]>([])
    const [isReady, setIsReady] = useState(false)

    useEffect(()=>{
        const params = new URLSearchParams(window.location.search)
        const cat = params.get("category")
        if(cat) {setSelectedCategory(cat)}
        setIsReady(true)
    }, [])

    const fetchProduct = async () => {
        try{
            const param = new URLSearchParams()
            if(search) param.append("query", search);
            if(selectedCategory !== "all"){
                param.append("category", selectedCategory)
            }
            const result = await axios.get(`/api/search?${param.toString()}`);
            setDisplayProducts(result.data.products)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() =>{
        if(!isReady) return
        fetchProduct()
    }, [selectedCategory, search, isReady])

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
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-6 px-4'>
      <div className='max-w-7xl mx-auto mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold'>Browse Products by Categories</h1>
        <p className='text-gray-300 text-sm'>
            Filter by category or search your favorite product or shop
        </p>
      </div>

      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* Left Sidebar */}
        <div className='md:col-span-1 bg-white/10 border border-white/20 rounded-xl p-4 space-y-4'>
          
          {/* Back to Home Button */}
          <button 
            onClick={() => router.push('/')}
            className='flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition w-full'
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>

          {/* Single Search Input */}
          <div className='relative flex items-center'>
            <Search className='absolute left-3 text-gray-400 pointer-events-none' size={16} />
            <input 
              type="text" 
              placeholder='Search product or shop...' 
              className='w-full pl-9 pr-3 py-2 rounded bg-black border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#00684D]'
              onChange={(e) => setSearch(e.target.value)} 
              value={search} 
            />
          </div>

          <hr className='border-white/10' />

          {/* Categories List */}
          <div className='space-y-2 max-h-64 overflow-auto pr-1'>
            <button
              className={`w-full flex gap-2 px-3 py-2 text-sm rounded ${
                selectedCategory === "all"
                ? "bg-[#00684D]"
                : "bg-white/10 hover:bg-white/20"
              }`}
              onClick={() => setSelectedCategory("all")} 
            >
              All Categories
            </button>

            {categoryList.map((cat) => {
              const Icon = cat.icon;   
              return (
                <button
                  key={cat.label}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded ${
                    selectedCategory === cat.label
                    ? "bg-[#00684D]"
                    : "bg-white/10 hover:bg-white/20"
                  }`}
                  onClick={() => setSelectedCategory(cat.label)} 
                >
                  <Icon size={18} /> {cat.label}   
                </button>
              );
            })}
          </div>


        </div>

        {/* Product Display Area */}
        <div className='md:col-span-3'>
          {displayProducts.length === 0 ? (
            <div className='text-center mt-20 text-gray-400'>
              No products found
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {displayProducts.map((p:any)=>(
                <ProductCard key={p._id} product={p}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage