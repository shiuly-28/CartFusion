"use client"
import React from 'react'
import UserGetCurrentUser from './hooks/UserGetCurrentUser'
import UseGetAllMerchant from './hooks/UseGetAllMerchant'
import UseGetAllProducts from './hooks/UseGetAllProductsData'

function InitUser() {
  UserGetCurrentUser()
  UseGetAllMerchant()
  UseGetAllProducts()
  return null
}

export default InitUser
