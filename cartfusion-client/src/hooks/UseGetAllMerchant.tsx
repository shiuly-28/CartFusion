
"use client"
import { setAllMerchantData } from '@/redux/merchantSlice'
import { AppDispatch } from '@/redux/store'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'


function UseGetAllMerchant() {
    const dispatch = useDispatch<AppDispatch>()
  useEffect(()=> {
    
    const fetchAllMerchant = async () =>{
        try{
              const result = await axios.get("/api/merchant/allMerchant")
              dispatch(setAllMerchantData(result.data.merchants))
            console.log(result.data)
        }catch(error){
          console.log(error)
          dispatch(setAllMerchantData([]))
        }
    }
    fetchAllMerchant()
  }, [])
  
}

export default UseGetAllMerchant
