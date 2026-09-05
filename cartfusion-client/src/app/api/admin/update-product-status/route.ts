import  Product  from '@/model/product.model';
import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
try{
await connectDb()
const session = await auth()
const adminUser = await User.findById(session?.user?.id)
if(!adminUser || adminUser.role !== "admin"){
return NextResponse.json({message: "only admin can approve product or admin is not found"},{status:403})
}
const {productId, status, rejectedReason} = await req.json()
if(!productId || !status){
return NextResponse.json({message: "productId and status are required"},
    {status:400})
}

const product = await Product.findById(productId)

if(status === "approved"){
product.verificationStatus = "approved",
product.approvedAt = new Date(),
product.rejectedReason = undefined
}

if(status === "rejected"){
product.verificationStatus = "rejected",
product.rejectedReason = rejectedReason || "rejected by admin"
}

await product.save()
return NextResponse.json({message: "product status updated", product},
    {status:200})

}catch(error){
return NextResponse.json({
            message: `product status update error ${error}`
        }, {status:500})
}
}