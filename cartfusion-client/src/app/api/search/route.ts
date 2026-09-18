/* eslint-disable @typescript-eslint/no-explicit-any */

import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        await connectDb()
        const {searchParams} = new URL(req.url)
        const query = searchParams.get("query") || "";
        const category = searchParams.get("category")
        const shop = searchParams.get("shop")

        const filter :any = {
            isActive: true,
            verificationStatus:"approved", 
        }
        if(query){
            filter.$or = [
                {title: {$regex: query, $options: "i"}},
                {description: {$regex: query, $options: "i"}},
                {category: {$regex: query, $options: "i"}},
            ]
        }

        // category filter

        if(category && category !== "all"){
            filter.category = category;
        }
        if(shop && shop !== "all"){
            filter.merchant = category;
        }

        const products = await Product.find(filter).populate("merchant", "shopName image")
        .sort({createAt:-1})
        return NextResponse.json(
            {
                success: true,
                count:products.length,
                products,
            },
            {status: 200}
        )
    }catch(error){
         return NextResponse.json({message: `failed to find product in category section ${error}`},
                    {status:500})
    }
}