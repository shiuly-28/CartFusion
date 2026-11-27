import connectDb from "@/lib/connectDB";
import Order from "@/model/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rowBody = await req.text();
  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_SECRET_KEY!;
    event = stripe.webhooks.constructEvent(rowBody, sig!, webhookSecret);
  } catch (error) {
    console.log("signature verification failed", error);
    return NextResponse.json(
      { message: `Webhook signature verification failed: ${error}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await connectDb();
    if (session?.metadata?.orderId) {
      await Order.findByIdAndUpdate(session.metadata.orderId, {
        isPaid: true,
      });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}