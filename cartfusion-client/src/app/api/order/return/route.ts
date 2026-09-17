import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
try{
    await connectDb()
    const {orderId} = await req.json()
    if(!orderId){
        return NextResponse.json(
            {message: "OrderId is required"}, {status: 400}
        )
    }
    const order = await Order.findById(orderId)

    if(!order){
        return NextResponse.json({message: "Order not found"}, {status: 404})
    }

    if(order.orderStatus === "cancelled"){
        return NextResponse.json(
            {message: "Cancelled order cannot be returned"},
             {status: 400}
        )
    }
    if(order.orderStatus === "returned"){
        return NextResponse.json(
            {message: "Order Already returned"},
             {status: 400}
        )
    }
    if(order.orderStatus !== "delivered"){
        return NextResponse.json(
            {message: "Only delivered orders can be  returned"},
             {status: 400}
        )
    }

    let returnedAmount = 0;

    for(const item of order.products)
    {
        returnedAmount += item.price * item.quantity
    }

    order.orderStatus = "returned"
    order.returnAmount = returnedAmount   // ✅ ফিক্স করা হলো

    await order.save()

     return NextResponse.json(order,{status: 200})

}catch(error){
         return NextResponse.json({message: `failed to returned order status ${error}`},
                    {status:500})
    }
}