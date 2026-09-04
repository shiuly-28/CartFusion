
"use client"
import { setAllProductData} from '@/redux/merchantSlice'
import { AppDispatch } from '@/redux/store'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'


function UseGetAllProducts() {
    const dispatch = useDispatch<AppDispatch>()
  useEffect(()=> {
    
    const fetchAllProduct = async () =>{
        try{
              const result = await axios.get("/api/merchant/allProduct")
              dispatch(setAllProductData(result.data))
            console.log(result.data)
        }catch(error){
          console.log(error)
          dispatch(setAllProductData([]))
        }
    }
    fetchAllProduct()
  }, [])
  
}

export default UseGetAllProducts
