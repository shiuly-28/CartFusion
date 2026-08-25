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
return NextResponse.json({message: "only admin can approve merchant or admin is not found"},{status:403})
}
const {merchantId, status, rejectReason} = await req.json()
if(!merchantId || !status){
return NextResponse.json({message: "only admin can approve merchant or admin is not found"},
    {status:400})
}

const merchant = await User.findById(merchantId)

if(status === "approved"){
merchant.verificationStatus = "approved",
merchant.isApproved = true,
merchant.approvedAt = new Date(),
merchant.rejectedReason = undefined
}

if(status === "rejected"){
merchant.verificationStatus = "rejected",
merchant.isApproved = false,
merchant.rejectedReason = rejectReason || "rejected by admin"
}

await merchant.save()
return NextResponse.json({message: "Merchant status updated", merchant},
    {status:200})

}catch(error){
return NextResponse.json({
            message: `Merchant status update error ${error}`
        }, {status:500})
}
}