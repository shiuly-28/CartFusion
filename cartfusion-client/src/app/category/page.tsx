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
      Sparkles
     } from 'lucide-react'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import ProductCard from '@/component/ProductCard';


function CategoriesPage() {
    const {AllMerchantData} = useSelector((state:RootState)=>state.merchant)

    const [selectedCategory,setSelectedCategory] = useState("all");
    const [selectedShop,setSelectedShop] = useState("all");
    const [search, setSearch] = useState("");
    const [shopSearch, setShopSearch] = useState("");
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
            if(selectedShop!== "all"){
                 param.append("shop", selectedShop)
            }
            const  result = await axios.get(`/api/search?${param.toString()}`);
            console.log(result.data.products)
            setDisplayProducts(result.data.products)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() =>{
        if(!isReady)return
        fetchProduct()
    }, [selectedCategory, search, selectedShop, isReady])

    const filterShop = !shopSearch ? [] : AllMerchantData.filter((v:any)=>v.shopName.toLowerCase().includes
    (shopSearch.toLowerCase()))
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

           <div className='space-y-2 max-h-64 overflow-auto'>
            {
    categoryList.map((cat) => {
        const Icon = cat.icon;   
        return (
            <button
                key={cat.label}
                className={`w-full flex gap-2 px-3 py-2 rounded ${
                    selectedCategory === cat.label
                    ? "bg-[#00684D]"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                onClick={() => {setSelectedCategory(cat.label)
                    setSelectedShop("all"); setShopSearch("")
                }} 
            >
                <Icon size={18} /> {cat.label}   
            </button>
            );
            })
            }
           </div>
           <input 
             type="text" placeholder="Search Shop...." 
            className="w-full px-3 py-2 rounded bg-black border border-white/20"
            onChange={(e) => setShopSearch(e.target.value)} 
            value={shopSearch}/>

            {shopSearch && 
            <div className='bg-black border border-white/20 rounded max-h-48 overflow-auto'>
                {
                    filterShop.map((v:any) =>(
                        <button key={v._id} className='block w-full px-3 py-2 text-left hover:bg-white/10'
                        onClick={()=>{
                            setShopSearch(v.shopName);
                            setSelectedShop(v._id)
                        }}>
                            {v.shopName}
                        </button>
                    ))
                }
         </div>}
        </div>

        <div className='md:col-span-3'>
            {
                displayProducts.length=== 0 ?(
                    <div className='text-center mt--20 sm:grid-cols-3'>
                        No products found
                    </div>
                    ):
                (
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-5'>
                    {displayProducts.map((p:any)=>(
                        <ProductCard key={p._id} product={p}/>
                    ))}
                </div>
            )
                    
            }
        </div>
       </div>
    </div>
  )
}

export default CategoriesPage
