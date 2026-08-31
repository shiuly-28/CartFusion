import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 401 } // 🌟 Unauthorized-এর জন্য 401 দেওয়া ভালো
      );
    }

    const userEmail = session.user.email;
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const file = formData.get("image") as File | null;

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Name and phone are required" },
        { status: 400 }
      );
    }

    // 🌟 আপডেটের জন্য ডাটা প্রস্তুত করা
    const updateData: { name: string; phone: string; image?: string } = {
      name,
      phone,
    };

    // যদি নতুন ইমেজ সিলেক্ট করা থাকে তবেই কেবল image ফিল্ড আপডেট হবে
    if (file && file.size > 0) {
      const imageUrl = await uploadOnCloudinary(file);
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: `Update profile error: ${error.message}` },
      { status: 500 }
    );
  }
}