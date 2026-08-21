import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

 export async function GET() {
    try{
        await connectDb() 
        const session = await auth()
        const user = User.findOne({email:session?.user?.email}).
        select("-password")
        if(!user){
            return NextResponse.json({message: "User is not found"},{status:400})
        }
        return NextResponse.json({user},{status:400})
    }catch(error){
        return NextResponse.json({message: `get current User error ${error}`},{status:500})
    };
    
 }