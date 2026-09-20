/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDb()
         const session = await auth();
        
            if (!session || !session.user?.id) {
              return NextResponse.json({ messages: "Unauthorized User" }, { status: 400 });
            }
            const {withUserId} = await req.json()
            if(!withUserId){
                return NextResponse.json(
                    {messages: "With user id required"},
                    {status: 400}
                )
            }

            const user = await User.findById(session.user.id).populate(
                "chats.with",
                "name image role shopName"
            )
            if(!user){
                return NextResponse.json({message: "User is not found"},{
                    status:400 })
            }
            const chat = user?.chats?.find(
                (c:any) => String(c.with?._id) === String(withUserId)
            )
             return NextResponse.json(chat?.message || [], { status: 200 })
    }catch(error){
        return NextResponse.json ({ message: "Failed to chat" },
      { status: 500 })
    }
}