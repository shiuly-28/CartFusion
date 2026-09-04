import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextResponse } from "next/server";

export async function GET(){
     try{
        await connectDb()
        const products = await Product.find().populate("merchant", "name, email, shopName")
        .sort({createdAt: -1})

        return NextResponse.json(products,{status:201})
     }catch(error){
        return NextResponse.json({message: `failed to get all  product ${error}`},{status:500})
     }
}