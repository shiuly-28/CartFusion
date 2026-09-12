
"use client"

import { AppDispatch } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'


function UseGetAllOrdersData() {
    const dispatch = useDispatch<AppDispatch>()
  useEffect(()=> {
    
    const fetchAllOrders = async () =>{
        try{
              const result = await axios.get("/api/order/allOrders")
              dispatch(setAllOrdersData(result.data))
            // console.log(result.data)
        }catch(error){
          console.log(error)
          dispatch(setAllOrdersData([]))
        }
    }
    fetchAllOrders()
  }, [])
  
}

export default UseGetAllOrdersData
