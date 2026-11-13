import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    const adminUser = await User.findById(session?.user?.id);

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Only admin can approve/reject merchant" },
        { status: 403 }
      );
    }

    const { merchantId, status, rejectedReason } = await req.json();

    if (!merchantId || !status) {
      return NextResponse.json(
        { message: "merchantId and status are required" },
        { status: 400 }
      );
    }

    const merchant = await User.findById(merchantId);
    if (!merchant) {
      return NextResponse.json(
        { message: "Merchant not found" },
        { status: 404 }
      );
    }

    if (status === "approved") {
      merchant.verificationStatus = "approved";
      merchant.isApproved = true;
      merchant.role = "merchant";
      merchant.approvedAt = new Date();
      merchant.rejectedReason = undefined;
    } else if (status === "rejected") {
      merchant.verificationStatus = "rejected";
      merchant.isApproved = false;
      merchant.rejectedReason = rejectedReason || "rejected by admin";
    } else {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    await merchant.save();

    const sanitizedMerchant = merchant.toObject ? merchant.toObject() : { ...merchant };
    delete sanitizedMerchant.password;

    return NextResponse.json(
      { message: "Merchant status updated", merchant: sanitizedMerchant },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Merchant status update error: ${error}` },
      { status: 500 }
    );
  }
}
