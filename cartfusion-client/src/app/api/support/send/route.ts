import { auth } from "@/auth";
import connectDb from "@/lib/connectDB";
import User from "@/model/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
    }

    const senderId = session.user.id;
    const { reciverId, text } = await req.json();

    if (!reciverId || !text) {
      return NextResponse.json(
        { message: "reciverId and text required" },
        { status: 400 }
      );
    }

    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(reciverId);

    // ==========================================
    // 1. SAVE FOR SENDER (প্রেরক)
    // ==========================================

    // যদি আগে থেকেই চ্যাট থ্রেড চালু থাকে, মেসেজ পুশ করবে
    const senderUpdated = await User.updateOne(
      {
        _id: senderObjectId,
        "chats.with": receiverObjectId,
      },
      {
        $push: {
          "chats.$.message": { // FIX: message -> messages
            sender: senderObjectId,
            text,
            createdAt: new Date(), // FIX: createAt -> createdAt
          },
        },
      }
    );

    // যদি চ্যাট থ্রেড না থাকে, নতুন চ্যাট অবজেক্ট তৈরি করবে
    if (senderUpdated.matchedCount === 0) {
      await User.updateOne(
        { _id: senderObjectId },
        {
          $push: {
            chats: {
              with: receiverObjectId,
              message: [
                {
                  sender: senderObjectId,
                  text,
                  createdAt: new Date(),
                },
              ],
            },
          },
        }
      );
    }

    // ==========================================
    // 2. SAVE FOR RECEIVER (প্রাপক)
    // ==========================================

    // যদি প্রাপকের চ্যাট থ্রেড থাকে, মেসেজ পুশ করবে
    const receiverUpdated = await User.updateOne(
      {
        _id: receiverObjectId, // FIX: senderObjectId -> receiverObjectId
        "chats.with": senderObjectId,
      },
      {
        $push: {
          "chats.$.message": { // FIX: message -> messages
            sender: senderObjectId,
            text,
            createdAt: new Date(),
          },
        },
      }
    );

   
    if (receiverUpdated.matchedCount === 0) {
      await User.updateOne(
        { _id: receiverObjectId }, 
        {
          $push: {
            chats: {
              with: senderObjectId,
              message: [
                {
                  sender: senderObjectId,
                  text,
                  createdAt: new Date(),
                },
              ],
            },
          },
        }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to chat" },
      { status: 500 }
    );
  }
}