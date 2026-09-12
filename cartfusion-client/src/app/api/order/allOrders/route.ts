import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import { NextResponse } from "next/server";

export async function GET(){
try{
    await connectDb()
    const session = await auth()
    if(!session || !session.user?.id || !session.user.email){
    return NextResponse.json({message:"Unauthorized User"},
    {status:400})
    }

    const orders = await Order.find().populate("buyer", "name email phone image")
    .populate("productMerchant", "name shopName email")
    .populate({
        path: "products.product",
        model: "Product",
        select: "title image1 price category stock merchant replacement"
    })
    .sort({ createdAt: -1});

    return NextResponse.json( orders,{status: 200})

}catch(error){
return NextResponse.json({message: `failed to create get all orders ${error}`},
            {status:500})
}
}