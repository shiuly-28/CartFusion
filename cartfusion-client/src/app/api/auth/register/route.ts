
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
         await  connectDb()
    const {name, email, password} =await req.json()

    const existUser = await User.findOne({email})

    if(existUser){
        return NextResponse.json({
            message:"User is already exist"
        },{status:400})
    }
    if(password.length < 6){
        return NextResponse.json({
            message:"password must be atleast six characters"
        }, {status:400})
    }

    const hasPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        name,
        email,
        password
    })
    return NextResponse.json({
            user
        }, {status:201})

    }catch(error){
            return NextResponse.json({
            message: `register error ${error}`
        }, {status:500})
    }
 
}