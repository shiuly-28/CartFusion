import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const merchants = await User.find({
      $or: [
        { role: "merchant" },
        { shopName: { $exists: true, $ne: "" } },
      ],
    })
      .select("-password -chats")
      .sort({ createdAt: -1 })
      .populate("merchantProducts");

    if (!merchants) {
      return NextResponse.json({ message: "Merchants not found" }, { status: 404 });
    }

    return NextResponse.json({ merchants }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get allMerchant error ${error}` },
      { status: 500 }
    );
  }
}
