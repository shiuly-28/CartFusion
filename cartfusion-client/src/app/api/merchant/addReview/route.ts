import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDb()
        const session = await auth()
        if(!session || !session.user?.id || !session.user.email){
            return NextResponse.json({message:"Unauthorized User"},
                {status:400})
        }

        const userId = session.user?.id

        const formData = await req.formData()

        const productId = formData.get("productId") as string;
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment") as string;
        const file = formData.get("image") as File | null;

        if(!productId){
            return NextResponse.json(
                {message: "Product ID is required"},
                { status : 400}
            )
        };

        if(!rating || rating < 1 || rating > 5){
            return NextResponse.json(
                {message: "Rating must be between 1 and 5"},
                {status: 400}
            )
        }

        if(!comment || comment.trim().length === 0){
            return NextResponse.json(
                {message: "Comment is required"},
                {status: 400}
            )
        }

        const product = await Product.findById(productId)
        if(!product){
            return NextResponse.json(
                {message:"Product not found"},
                {status: 404}
            )
        }

        let imageUrl

        if(file){
            imageUrl = await uploadOnCloudinary(file)
        }

        product.reviews.push({
            rating,
            user: userId,
            comment,
            image:imageUrl
        })


        await product.save()

        return NextResponse.json(
      { message: "Review added successfully" },
      { status: 201 }
    );

    }catch(error){
        return NextResponse.json({message: `failed to create add  review ${error}`},
            {status:500})
    }
}