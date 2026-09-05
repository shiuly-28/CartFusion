import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        await connectDb()
         const session = await auth()
                if(!session || !session.user?.id || !session.user.email){
                    return NextResponse.json({message:"Unauthorized User"},{status:400})
                }

                const formData = await req.formData()
                const productId = formData.get("productId")

                const product = await Product.findById({productId})

                 if(!product){
                    return NextResponse.json({message:"Product is not found"},{status:400})
                }

                if(String(product.merchant) !== String(session.user.id))
                {
                    return NextResponse.json({message:"Not allowed to edit this product"},
                        {status:403})
                }

                 const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const stock = Number(formData.get("stock"))
        const category = formData.get("category") as string;
        const isWearable = formData.get("isWearable") === "true"
        const sizes = formData.getAll("sizes")
        const replacementDays = Number(formData.get("replacementDays") || 0);
        const freeDelivey = formData.get("freeDelivey") === "true";
        const warranty = formData.get("warranty") as string || "No Warranty";
        const payOnDelivey = formData.get("payOnDelivey") === "true";
        const detailsPoint = formData.getAll("detailsPoint");
        const img1 = formData.get("image1") as Blob | null;
        const img2 = formData.get("image2") as Blob | null;
        const img3 = formData.get("image3") as Blob | null;
        const img4 = formData.get("image4") as Blob | null;

        let image1 = product.image1;
        let image2 = product.image2;
        let image3 = product.image3;
        let image4 = product.image4;

        if(img1){
            image1 = await uploadOnCloudinary(img1)
        }
        if(img2){
            image2 = await uploadOnCloudinary(img2)
        }
        if(img3){
            image3 = await uploadOnCloudinary(img3)
        }
        if(img4){
            image4 = await uploadOnCloudinary(img4)
        }

          if(isWearable && sizes.length === 0){
            return NextResponse.json({message:"Sizes are required for wearble product"},
            {status:400})
            }

        const updatedProduct = await Product.findByIdAndUpdate(productId,{
              title,
            description,
            price,
            stock,
            isStockAvailable:stock > 0,
            image1,
            image2,
            image3,
            image4,
            category,
            isWearable,
            sizes: isWearable ? sizes : [],
            replacementDays,
            warranty,
            payOnDelivey,
            freeDelivey,
            detailsPoint,
            verificationStatus: "pending",
            isActive: false
        },{new: true});

        return NextResponse.json(updatedProduct,{status:200})
        
    }catch(error){
 return NextResponse.json({message: `update product details error ${error}`},
                {status:500})
    }
}