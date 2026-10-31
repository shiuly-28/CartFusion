import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
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

    const { otp, orderId } = await req.json();
    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "orderId and otp required" },
        { status: 400 }
      );
    }

    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Role check: Only the assigned merchant or admin can verify delivery OTP
    const isMerchant = String(order.productMerchant) === String(currentUser._id);
    const isAdmin = currentUser.role === "admin";

    if (!isMerchant && !isAdmin) {
      return NextResponse.json(
        { message: "Only the merchant or admin can verify delivery OTP" },
        { status: 403 }
      );
    }

    if (
      order.deliveryOtp !== otp ||
      !order.otpExpiresAt ||
      order.otpExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    order.orderStatus = "delivered";
    order.isPaid = true;
    order.deliveryDate = new Date();
    order.deliveryOtp = undefined;
    order.otpExpiresAt = undefined;

    await order.save();

    return NextResponse.json(
      { message: "Order delivered successfully", order },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to verify delivery OTP: ${error}` },
      { status: 500 }
    );
  }
}
