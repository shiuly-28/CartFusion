"use client"
import React from 'react'
import UserGetCurrentUser from './hooks/UserGetCurrentUser'
import UseGetAllMerchant from './hooks/UseGetAllMerchant'
import UseGetAllProducts from './hooks/UseGetAllProductsData'
import UseGetAllOrdersData from './hooks/UseGetAllOrdersData'


function InitUser() {
  UserGetCurrentUser()
  UseGetAllMerchant()
  UseGetAllProducts()
  UseGetAllOrdersData()
  return null
}

export default InitUser
