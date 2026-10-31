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
        { message: "OrderId is required" },
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

    const order = await Order.findById(orderId).populate("products.product");
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Role check: Only the buyer or admin can initiate a return
    const isBuyer = String(order.buyer) === String(currentUser._id);
    const isAdmin = currentUser.role === "admin";

    if (!isBuyer && !isAdmin) {
      return NextResponse.json(
        { message: "You are not authorized to return this order" },
        { status: 403 }
      );
    }

    if (order.orderStatus === "cancelled") {
      return NextResponse.json(
        { message: "Cancelled order cannot be returned" },
        { status: 400 }
      );
    }

    if (order.orderStatus === "returned") {
      return NextResponse.json(
        { message: "Order already returned" },
        { status: 400 }
      );
    }

    if (order.orderStatus !== "delivered") {
      return NextResponse.json(
        { message: "Only delivered orders can be returned" },
        { status: 400 }
      );
    }

    // Check return / replacement window (days from deliveryDate)
    if (order.deliveryDate && !isAdmin) {
      const deliveryTime = new Date(order.deliveryDate).getTime();
      const currentTime = Date.now();
      // Use replacementDays of products or default 7 days
      const maxDays = Math.max(
        ...order.products.map((p: any) => p.product?.replacementDays || 7)
      );
      const diffDays = (currentTime - deliveryTime) / (1000 * 60 * 60 * 24);
      if (diffDays > maxDays) {
        return NextResponse.json(
          { message: `Return window of ${maxDays} days has expired` },
          { status: 400 }
        );
      }
    }

    let returnedAmount = 0;
    for (const item of order.products) {
      returnedAmount += item.price * item.quantity;

      // Restore stock when returned
      const prodId = (item.product as any)?._id || item.product;
      if (prodId && item.quantity > 0) {
        await Product.findByIdAndUpdate(prodId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.orderStatus = "returned";
    order.returnAmount = returnedAmount;
    await order.save();

    return NextResponse.json(
      { message: "Order returned successfully", order },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to return order: ${error}` },
      { status: 500 }
    );
  }
}
