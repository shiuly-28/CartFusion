import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

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

         const productTotal = product.price * quantity

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

            productTotal,
            deliveryCharge,
            serviceCharge,
            totalAmount: amount,

            paymentMethod: "cod",
            isPaid: false,
            orderStatus: "pending",
            returnedAmount: 0,

            address,
         })

         await Product.findByIdAndUpdate(productId, {
            $inc: {stock : -quantity}

         })

         user.cart = user.cart.filter((item:any) =>
         item.product._id.toString() !== productId.toString())

         user.orders.push(order._id)
          await user.save()

          return NextResponse.json(
            {
               message: "✅ COD Order placed successfully",
               order,
            },
            {status: 201}
          )
    }catch(error){
         return NextResponse.json({message: `failed to create order in cod ${error}`},
            {status:500})
    }
}