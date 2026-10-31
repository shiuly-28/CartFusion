import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
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

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { message: "orderId is required" },
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

    // Role check: Only the buyer, the merchant of this order, or an admin can cancel
    const isBuyer = String(order.buyer) === String(currentUser._id);
    const isMerchant = String(order.productMerchant) === String(currentUser._id);
    const isAdmin = currentUser.role === "admin";

    if (!isBuyer && !isMerchant && !isAdmin) {
      return NextResponse.json(
        { message: "You are not authorized to cancel this order" },
        { status: 403 }
      );
    }

    // Order state validation
    if (order.orderStatus === "cancelled") {
      return NextResponse.json(
        { message: "Order is already cancelled" },
        { status: 400 }
      );
    }

    if (order.orderStatus === "delivered" || order.orderStatus === "returned") {
      return NextResponse.json(
        { message: "Delivered or returned order cannot be cancelled" },
        { status: 400 }
      );
    }

    // Buyers cannot cancel once the order has been shipped
    if (order.orderStatus === "shipped" && isBuyer && !isAdmin && !isMerchant) {
      return NextResponse.json(
        { message: "Shipped orders cannot be cancelled by buyer" },
        { status: 400 }
      );
    }

    // Restore stock for all products in the order
    for (const item of order.products) {
      if (item.product && item.quantity > 0) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    await order.save();

    return NextResponse.json(
      { message: "Order Cancelled successfully", order },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to cancel order: ${error}` },
      { status: 500 }
    );
  }
}
