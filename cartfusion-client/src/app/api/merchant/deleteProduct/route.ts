import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })
        }

        const { productId } = await req.json()
        if (!productId) {
            return NextResponse.json({ message: "productId is required" }, { status: 400 })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        if (String(product.merchant) !== String(session.user.id)) {
            return NextResponse.json({ message: "Not allowed to delete this product" }, { status: 403 })
        }

        await Product.findByIdAndDelete(productId)

        return NextResponse.json({ message: "Product deleted successfully", productId }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: `Failed to delete product ${error}` }, { status: 500 })
    }
}