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
         const {productId, quantity} = await req.json()

         if(!productId || quantity < 1){
            return NextResponse.json(
                {message: "Invalid data"},
                {status: 400}
            )
         }

         const user = await User.findById(session.user.id)
            if(!user || !user.cart){
            return NextResponse.json({message: "User's Cart is not found"},
            {status: 404})
            }

            const item = user.cart.find((item: any) => 
                item.product.toString() === productId.toString()
            )

            if(!item){
            return NextResponse.json({message: "product is not found"},
            {status: 404})
            }

            item.quantity = quantity
            await user.save()

            return NextResponse.json(
                {message: "Quantity upload", cart: user.cart},
                {status:200}
            )
    }catch(error){
         return NextResponse.json({message: `failed to create update product ${error}`},
                    {status:500})
    }
}