import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export async function POST(req:NextRequest){

    const sig = req.headers.get("stripe-signature")
    const rowBody = await req.text()
    let event
try{
    event = stripe.webhooks.constructEvent(
    rowBody,sig!,process.env.STRIPE_SECRET_KEY!)
}catch(error){
console.log("signature verification failed",error)
}
if(event?.type === "checkout.session.completed"){
    const session = event.data.object
    await connectDb()
    await Order.findById(session?.metadata?.orderId,{
        isPaid:true
    })
}
return NextResponse.json({recived:true},{status:200})
}