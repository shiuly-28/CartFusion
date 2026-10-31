import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import { sendDeliveryOtpEmail } from "@/lib/mailer";
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

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "orderId and status are required" },
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

    const order = await Order.findById(orderId).populate("buyer");
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Role check: Only the merchant of this order or admin can update status
    const isMerchant = String(order.productMerchant) === String(currentUser._id);
    const isAdmin = currentUser.role === "admin";

    if (!isMerchant && !isAdmin) {
      return NextResponse.json(
        { message: "Only the assigned merchant or admin can update order status" },
        { status: 403 }
      );
    }

    if (order.orderStatus === "cancelled" || order.orderStatus === "returned") {
      return NextResponse.json(
        { message: `Cannot update a ${order.orderStatus} order` },
        { status: 400 }
      );
    }

    if (status === "confirmed" || status === "shipped") {
      order.orderStatus = status;
      await order.save();

      return NextResponse.json(
        { message: "Order status updated", order },
        { status: 200 }
      );
    }

    if (status === "delivered") {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      order.deliveryOtp = otp;
      order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await order.save();

      const email = (order.buyer as any)?.email;
      if (!email) {
        return NextResponse.json(
          { message: "Buyer email not found" },
          { status: 400 }
        );
      }

      await sendDeliveryOtpEmail(email, otp);

      return NextResponse.json({
        message: "OTP sent to buyer email",
        otpSent: true,
      });
    }

    return NextResponse.json(
      { message: "Invalid status" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to update order status: ${error}` },
      { status: 500 }
    );
  }
}
