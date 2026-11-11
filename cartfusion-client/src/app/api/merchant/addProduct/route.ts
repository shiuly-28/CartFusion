import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session || !session.user?.id || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized User. Please login first." },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Role and Approval check: Only approved merchants or admins can add products
    const isApprovedMerchant = user.role === "merchant" && user.isApproved === true;
    const isAdmin = user.role === "admin";

    if (!isApprovedMerchant && !isAdmin) {
      return NextResponse.json(
        { message: "Only approved merchants can add products" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const isWearable = formData.get("isWearable") === "true";
    const sizes = formData.getAll("sizes");
    const replacementDays = Number(formData.get("replacementDays") || 0);
    const freeDelivery =
      formData.get("freeDelivery") === "true" ||
      formData.get("freeDelivey") === "true";
    const warranty = (formData.get("warranty") as string) || "No Warranty";
    const payOnDelivery =
      formData.get("payOnDelivery") === "true" ||
      formData.get("payOnDelivey") === "true";
    const detailsPoint = formData.getAll("detailPoints");
    const img1 = formData.get("image1") as Blob;
    const img2 = formData.get("image2") as Blob;
    const img3 = formData.get("image3") as Blob;
    const img4 = formData.get("image4") as Blob;

    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !img1 ||
      !img2 ||
      !img3 ||
      !img4
    ) {
      return NextResponse.json(
        { message: "All fields & 4 images required" },
        { status: 400 }
      );
    }

    if (isWearable && sizes.length === 0) {
      return NextResponse.json(
        { message: "Sizes are required for wearable product" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary only after authorization passes
    const image1 = await uploadOnCloudinary(img1);
    const image2 = await uploadOnCloudinary(img2);
    const image3 = await uploadOnCloudinary(img3);
    const image4 = await uploadOnCloudinary(img4);

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      isStockAvailable: stock > 0,
      image1,
      image2,
      image3,
      image4,
      category,
      merchant: user._id,
      isWearable,
      size: isWearable ? sizes : [],
      replacementDays,
      warranty,
      freeDelivery,
      payOnDevelivery: payOnDelivery,
      detailsPoint,
      verificationStatus: "pending",
      isActive: false,
    });

    await User.findByIdAndUpdate(
      user._id,
      { $push: { merchantProducts: product._id } },
      { new: true }
    );

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to create new product: ${error}` },
      { status: 500 }
    );
  }
}
