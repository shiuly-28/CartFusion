/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth"
import connectDb from "@/lib/connectDB"
import User from "@/model/user.model"
import Product from "@/model/product.model" 
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDb()
    const session = await auth()
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })
    }


    const user = await User.findById(session.user.id).populate("cart.product")
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    
    const validCart = (user.cart || []).filter((item: any) => item && item.product)

    return NextResponse.json({ cart: validCart }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to fetch cart: ${error}` },
      { status: 500 }
    )
  }
}