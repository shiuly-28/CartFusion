import connectDb from "@/lib/connectDB";
import { sendDeliveryOtpEmail } from "@/lib/mailer";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDb()
        const {orderId, status} = await req.json()

        const order = await Order.findById(orderId).populate("buyer")

        if(!order){
            return NextResponse.json({message: "Order not found"}, 
                {status:404});
        }
        if(status === "confirmed" || status === "shipped"){
            order.orderStatus = status
            order.save()
            return NextResponse.json({message: "Order status updated"}, 
                {status:200});
        }

        if(status==="delivered"){
            const otp = Math.floor(1000 + Math.random()*9000).toString()
            order.deliveryOtp = otp
            order.otpExpriseAt = new Date(Date.now() + 10 *60 *1000)
            await order.save()
            const email = order.buyer?.email

            if(!email){
                return NextResponse.json(
                    {message: "Buyer email not found"},
                    {status: 400}
                )
            }
            await sendDeliveryOtpEmail(email, otp)
            return NextResponse.json({message: "OTP sent to buyer email"})
        }
          return NextResponse.json(
                    {message: "Buyer email not found"},
                    {status: 400}
                )
    }catch(error){
         return NextResponse.json({message: `failed to update order status ${error}`},
                    {status:500})
    }
}