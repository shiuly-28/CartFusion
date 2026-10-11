/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth"
import connectDb from "@/lib/connectDB"
import Product from "@/model/product.model"
import User from "@/model/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDb()
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })

    const { items } = await req.json()
    if (!Array.isArray(items))
      return NextResponse.json({ message: "Invalid items" }, { status: 400 })

    const user = await User.findById(session.user.id)
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

    for (const it of items.slice(0, 50)) {
      const qty = Number(it?.quantity)
      if (!it?.productId || !Number.isInteger(qty) || qty < 1 || qty > 20) continue

      const exists = await Product.exists({ _id: it.productId })
      if (!exists) continue

      const found = user.cart.find((c: any) => String(c.product) === String(it.productId))
      if (found) found.quantity += qty
      else user.cart.push({ product: it.productId, quantity: qty })
    }

    await user.save()
    return NextResponse.json({ message: "Cart merged" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: `Merge failed: ${error}` }, { status: 500 })
  }
}