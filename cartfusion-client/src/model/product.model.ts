import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IProduct {
  _id?: mongoose.Types.ObjectId;

  title: string;
  description: string;
  price: number;

  stock: number;
  isStockAvailable?: boolean;

  merchant: IUser | mongoose.Types.ObjectId;

  image1: string;
  image2: string;
  image3: string;
  image4: string;

  category: string;

  isWearable: boolean;
  size?: string[];

  verificationStatus: "pending" | "approved" | "rejected";
  requestedAt?: Date;
  approvedAt?: Date;
  rejectedReason?: string;

  isActive?: boolean;

  replacementDays?: number;
  freeDelivery?: boolean;
  warranty?: string;
  payOnDevelivery?: boolean;

  detailsPoint?: string[];

  reviews?: {
    user: IUser | mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    image?: string;
    createdAt?: Date;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: true, // 🌟 isRequired -> required
    },
    description: {
      type: String,
      required: true, // 🌟 isRequired -> required
    },
    price: {
      type: Number,
      required: true, // 🌟 isRequired -> required
    },
    stock: {
      type: Number,
      required: true, // 🌟 isRequired -> required
    },
    isStockAvailable: {
      type: Boolean,
      default: true,
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image1: {
      type: String,
      required: true, // 🌟 isRequired -> required
    },
    image2: {
      type: String,
      required: true, // 🌟 isRequired -> required
    },
    image3: {
      type: String,
      required: true, // 🌟 isRequired -> required
    },
    image4: {
      type: String,
      required: true, // 🌟 isRequired -> required
    },
    category: {
      type: String,
      required: true, // 🌟 isRequired -> required
    },
    isWearable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [String],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: {
      type: Date,
    },
    requestedAt: {
      type: Date,
    },
    rejectedReason: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    replacementDays: {
      type: Number, // 🌟 number -> Number
      default: 0,
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    warranty: {
      type: String,
      default: "No Warranty",
    },
    payOnDevelivery: {
      type: Boolean,
      default: false,
    },
    detailsPoint: {
      type: [String],
      default: [],
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
        image: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product =
  mongoose.models?.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;