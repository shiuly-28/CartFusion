/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
    }

    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // --- ROLE: USER ---
    // যদি আপনি চান ইউজার যার কাছ থেকে অর্ডার করেছে তাদের পাবে:
    if (currentUser.role === "user") {
      const orders = await Order.find({ buyer: currentUser._id })
        .populate("productMerchant", "name image shopName role");

      const merchantMap = new Map<string, any>();

      orders.forEach((order: any) => {
        if (order.productMerchant && order.productMerchant._id) {
          merchantMap.set(
            String(order.productMerchant._id),
            order.productMerchant
          );
        }
      });

      // অ্যাডমিনকেও চ্যাটে রাখতে চাইলে:
      const admin = await User.findOne({ role: "admin" }).select("name image role");
      const merchantsList = Array.from(merchantMap.values());
      if (admin) merchantsList.unshift(admin);

      return NextResponse.json(merchantsList, { status: 200 });
    }

    // --- ROLE: MERCHANT ---
    if (currentUser.role === "merchant") {
      const orders = await Order.find({ productMerchant: currentUser._id })
        .populate("buyer", "name image shopName role");

      const buyerMap = new Map<string, any>();

      orders.forEach((order: any) => {
        if (order.buyer && order.buyer._id) {
          buyerMap.set(
            String(order.buyer._id),
            order.buyer
          );
        }
      });

      const admin = await User.findOne({ role: "admin" }).select("name image role");
      const buyersList = Array.from(buyerMap.values());
      if (admin) buyersList.unshift(admin);

      return NextResponse.json(buyersList, { status: 200 });
    }

    // --- ROLE: ADMIN ---
    if (currentUser.role === "admin") {
      const allMerchantsAndUsers = await User.find({
        role: { $in: ["merchant", "user"] }
      }).select("name image shopName role");
      
      return NextResponse.json(allMerchantsAndUsers, { status: 200 });
    }

    return NextResponse.json([], { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}