"use client"
import React from 'react'
import UserGetCurrentUser from './hooks/UserGetCurrentUser'
import UseGetAllMerchant from './hooks/UseGetAllMerchant'

function InitUser() {
  UserGetCurrentUser()
  UseGetAllMerchant()
  return null
}

export default InitUser
