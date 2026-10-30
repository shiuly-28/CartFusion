import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    if (!session || !session.user?.id || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 401 }
      );
    }

    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    let filter: Record<string, unknown> = {};

    if (currentUser.role === "admin") {
      // Admin: প্ল্যাটফর্মের সব অর্ডার দেখতে পারবে
      filter = {};
    } else if (currentUser.role === "merchant") {
      // Merchant: তার স্টোরের অর্ডারগুলো এবং নিজে ক্রেতা হিসেবে দেওয়া অর্ডারগুলো দেখতে পারবে
      filter = {
        $or: [
          { productMerchant: currentUser._id },
          { buyer: currentUser._id },
        ],
      };
    } else {
      // Buyer / সাধারণ ক্রেতা: শুধুমাত্র তার নিজের অর্ডার দেখতে পারবে
      filter = { buyer: currentUser._id };
    }

    const orders = await Order.find(filter)
      .select("-deliveryOtp")
      .populate("buyer", "name email phone image")
      .populate("productMerchant", "name shopName email")
      .populate({
        path: "products.product",
        model: "Product",
        select: "title image1 price category stock merchant replacementDays",
      })
      .sort({ createdAt: -1 });

    const validOrders = orders.filter((o) => o.buyer);

    return NextResponse.json(validOrders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `failed to get orders: ${error}` },
      { status: 500 }
    );
  }
}
