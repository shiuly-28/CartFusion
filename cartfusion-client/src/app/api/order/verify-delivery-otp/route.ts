import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
try{
    await connectDb()
    const {otp, orderId} = await req.json()
    if(!orderId || !otp){
        return NextResponse.json(
            {message: "orderId and otp required"},
            {status: 400}
        )
    }
    const order = await Order.findById(orderId)
    if(!order){
        return NextResponse.json({message: "Order not found"}, 
            {status: 404 })
    }
    if(
        order.deliveryOtp !== otp || 
        !order.otpExpiresAt || 
        order.otpExpiresAt < new Date()
    ){
        return NextResponse.json(
             {message: "Invalid or expired OTP"},
            {status: 400}
        )
    }

    order.orderStatus = "delivered";
    order.isPaid = "true"
    order.deliveryDate = new Date()
    order.deliveryOtp = undefined;
    order.otpExpiresAt = undefined

    await order.save();

    return NextResponse.json({message: "Order delivered"},{ status:200 })
}catch(error){
 return NextResponse.json({message: `failed to update order status ${error}`},
                    {status:500})
}
}