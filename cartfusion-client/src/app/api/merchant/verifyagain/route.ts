import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDb()
        const {shopName, shopAddress, gstNumber} = await req.json()
         if(!shopName || !shopAddress || !gstNumber){
            return NextResponse.json({message: "All fields"},
                {status:400})
        }

        const session = await auth()

        if(!session?.user?.email){
            return NextResponse.json({message: "Unauthorized access"},
                {status:401})
        }
        const UpdatedMerchant = await User.findOneAndUpdate({email:session?.user?.email},{
            shopName,
            shopAddress,
            gstNumber, 
            verificationStatus: "pending",
            requestAt:new Date(),
            rejectedReason:null,
            isApproved:false
        },{new:true})
        if(!UpdatedMerchant){
            return NextResponse.json({message: "Merchant not found"},
                {status:400})
        }
         return NextResponse.json({message: "Merchant Details Submitted Successfully", UpdatedMerchant},
                {status:200})
    }catch(error){
        return NextResponse.json({message: `Verify merchant details error ${error}`},
                {status:500})
    }
}