import mongoose from "mongoose"
import { IProduct } from "./product.model"
import { IUser } from "./user.model";
import { number } from "motion";
import { tr } from "motion/react-client";

export interface IOrder{
products:{
    product:IProduct;
    quantity:number;
    price:number;
}[];

buyer: IUser;
productMerchant:IUser;

productsTotal:number;
deliveryCharge:number;
totalAmount: number;

paymentMethod: "cod" | "stripe";
isPaid: boolean;

orderStatus:
| "pending"
| "confirmed"
| "shipped"
| "delivered"
| "returned"
| "cancelled";

cancelledAt?:Date;

returnAmount?: number;

address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string
}

paymentDetails?:{
    stripePaymentId?: string;
    stripeSessionId: string;
};

deliveryDate?: string;
deliveryOtp?: string;

otpExpriseAt?:Date;

createAt:Date;
updatedAt: Date;

}

const orderSchema = new mongoose.Schema<IOrder>({

    products: [
      {
        product:{type:mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity:{
        type:Number,
        required: true
      },
      price:{
        type: Number,
        required: true,
      },
    },
    ],

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productMerchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    productsTotal: {
        type: Number,
        required:true
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "string"],
        required:true

    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    orderStatus: {
        type: String,
        enum: [
            "pending",
            "confirmed" ,
            "shipped",
            "delivered",
            "returned",
            "cancelled",
        ],
        default:"pending",
    },
    cancelledAt:{
        type:Date,
    },

    returnAmount:{
        type:Number,
        default:0
    },
    address: {
        name: {
            type:String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true
        },
    },

    paymentDetails: {
        stripePaymentId: String,
        stripeSessionId: String
    },
    deliveryDate: {
        type: Date,
    },
    deliveryOtp: {
        type: String,
    },
    otpExpriseAt: {
        type: Date,
    }


},{timestamps:true})

const Order =
  mongoose.models?.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;