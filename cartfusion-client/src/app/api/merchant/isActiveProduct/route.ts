import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 401 }
      );
    }

    const { productId, isActive } = await req.json();

    if (!productId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "productId and boolean isActive are required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product is not found" },
        { status: 404 }
      );
    }

    const currentUser = await User.findById(session.user.id);
    const isOwner = String(product.merchant) === String(session.user.id);
    const isAdmin = currentUser?.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: "Not allowed to modify this product. You are not the owner." },
        { status: 403 }
      );
    }

    product.isActive = isActive;
    await product.save();

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Update isActive error: ${error}` },
      { status: 500 }
    );
  }
}
