/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest){
    try{
       await connectDb()
             const session = await auth()
            if(!session || !session.user?.id || !session.user.email){
            return NextResponse.json({message:"Unauthorized User"},
            {status:400})
        }

        const userId = session.user?.id;

        const { productId,
            quantity,
            address,
            amount,
             deliveryCharge,
             serviceCharge,
            }
         = await req.json()

         if(!productId || !quantity){
            return NextResponse.json(
                {message: "productId and quantity required"},
                {status: 400}
            )
         }

         if(
            !address?.name || 
            !address?.phone || 
            !address?.address|| 
            !address?.city|| 
            !address?.pincode
         ){
            return NextResponse.json(
               {message: "All  addres fields are required"},
               {status:400} 
            );
         }
        
         if(
            typeof amount !== "number" ||
            typeof deliveryCharge !== "number" ||
            typeof serviceCharge !== "number" 
         ){
             return NextResponse.json(
               {message: "Invalid amount, delivery or service charge"},
               {status:400} 
            );
         }

         const user = await User.findById(userId)
         if(!user || !user.cart){
            return NextResponse.json(
                   {message: "user or cart not found"},
               {status:400} 
            )
         }

         const cartItem = user.cart.find((item:any)=>
        item.product._id.toString()=== productId.toString())

         if(!cartItem){
            return NextResponse.json(
                 {message: "Invalid amount, delivery or service charge"},
               {status:400}
            )
         }

             const product = await Product.findById(productId)
         if(!product){
            return NextResponse.json(
                   {message: "product or cart not found"},
               {status:400} 
            )
         }

         if(product.stock < quantity){
             return NextResponse.json(
                 {message: `Insufficient stock for ${product.title}`},
               {status:400}
            )
         }

         const productsTotal = product.price * quantity

         const order = await Order.create({
            buyer: userId,

            products: [
               {
                  product: product._id,
                  quantity,
                  price: product.price,
               },
            ],
            productMerchant: product.merchant,

            productsTotal,
            deliveryCharge,
            serviceCharge,
            totalAmount: amount,

            paymentMethod: "stripe",
            isPaid: false,
            orderStatus: "pending",
            returnAmount: 0,

            address,
         })

         await Product.findByIdAndUpdate(productId, {
            $inc: {stock : -quantity}

         })

         user.cart = user.cart.filter((item:any) =>
         item.product._id.toString() !== productId.toString())

         user.orders.push(order._id)
          await user.save()
        
          const strpeSession = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            success_url: `${process.env.NEXT_BASE_URL}/order-success`,
            cancel_url: `${process.env.NEXT_BASE_URL}/order-failed`,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.title
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata:{
                orderId: order._id.toString(),
                productId: product._id.toString(),
            },
          })

          return NextResponse.json({url:strpeSession.url},{status: 200})
         
    }catch(error){
         return NextResponse.json({message: `Online payment failed ${error}`},
            {status:500})
    }
}