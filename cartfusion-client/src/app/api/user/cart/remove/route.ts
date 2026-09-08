import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
         await connectDb()
             const session = await auth()
            if(!session || !session.user?.id || !session.user.email){
            return NextResponse.json({message:"Unauthorized User"},
            {status:400})
        }

         const {productId}  = await req.json()

          if(!productId){
            return NextResponse.json(
                {message: "productId is required"},
                {status: 400}
            )
         }

         const user = await User.findById(session.user.id)
            if(!user || !user.cart){
            return NextResponse.json({message: "User's Cart is not found"},
            {status: 404})
            }

            user.cart = user.cart.filter((item: any) => 
                item.product.toString() !== productId.toString()
            )

            await user.save()

            return NextResponse.json(
                {message: "Card item removed"},
                {status:200}
            )
    }catch(error){
             return NextResponse.json({message: `failed to create remove cart item ${error}`},
                            {status:500})
    };
    
}