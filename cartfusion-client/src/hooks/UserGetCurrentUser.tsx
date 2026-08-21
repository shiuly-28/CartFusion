"use client"

import axios from 'axios'
import React, { useEffect } from 'react'

function UserGetCurrentUser() {
 useEffect(()=> {
    const fetchUser = async () => {
        try{
            const result = await axios.get("/api/user/currentUser")
            console.log(result.data)
        }catch(error){
            console.log(error)
        }
    }
    
 }, [])
}

export default UserGetCurrentUser
