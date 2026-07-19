import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    connectDb()
    const {name, email, password} =await req.json()

    const existUser = await User.find({email})

    if(existUser){
        return NextResponse.json({
            message:"User is already exist"
        },)
    }
}