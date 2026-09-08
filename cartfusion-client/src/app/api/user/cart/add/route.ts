import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
         await connectDb()
                const session = await auth()
                if(!session || !session.user?.id || !session.user.email){
                    return NextResponse.json({message:"Unauthorized User"},{status:400})
                }

                const {productId, quantity = 1} =await req.json()

    if(!productId){
        return NextResponse.json({message: "Product ID required"}, {status: 400})
    }

    const user = await User.findById(session.user?.id)

     if(!user){
        return NextResponse.json({message: "User is not found"}, {status: 400})
    }

    const product = await Product.findById(productId)

    if(!product){
        return NextResponse.json({message: "Product is not found"}, {status: 400})
    }

    const existingProduct = user.cart.find((item: any) => item.product?.toString() === productId.toString())

    if(existingProduct){
        existingProduct.quantity += quantity

    }else{
        user.cart.push({
            product: product._id,
            quantity
        })
    }

    await user.save()

    return NextResponse.json(
        {
            messaage: "Product added to cart ✅",
            cart: user.cart,
        },
        {status: 200}
    )

    }catch(error){
        return NextResponse.json({message: `failed to create add product ${error}`},
            {status:500})
    }
}