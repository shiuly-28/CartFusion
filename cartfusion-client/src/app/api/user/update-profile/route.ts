import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb()
    const session = await auth()
    if (!session || !session.user?.email || !session.user.id) {
      return NextResponse.json({ message: "UnAuthorized User" },
        { status: 400 })
    }

    const userEmail = session.user.email;    // 👈 এখানে বসান (নতুন লাইন)

    const formData = await req.formData()
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const file = formData.get("image") as File | null;

    if (!name || !phone) {
      return NextResponse.json({ message: "Name and phone are required" },
        { status: 400 })
    }
    let imageUrl
    if (file) {
      imageUrl = await uploadOnCloudinary(file)
    }
    const UpdatedUser = await User.findOneAndUpdate({ email: userEmail }, {   // 👈 এখানে ব্যবহার করুন
      name,
      phone,
      image: imageUrl,
    }, { new: true })

    if (!UpdatedUser) {
      return NextResponse.json({ message: "user not found" },
        { status: 400 })
    }
    return NextResponse.json(UpdatedUser, { status: 200 })

  } catch (error) {
    return NextResponse.json({ message: `Edit role and phone error ${error}` },
      { status: 500 })
  }
}