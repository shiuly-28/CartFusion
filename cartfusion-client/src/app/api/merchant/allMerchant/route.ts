import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        await connectDb()
        const merchants = await User.find({role : "merchant"}).sort({createdAt:-1})
        if(!merchants){
             return NextResponse.json({message: "Merchant are  not found"},{status:400})
        }
        return NextResponse.json({merchants},{status:200})
    }catch(error){
         return NextResponse.json({message: `get allMerchant error ${error}`},{status:500})
    }
}