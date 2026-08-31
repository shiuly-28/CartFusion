
import mongoose from "mongoose";
import { IUser } from "./user.model";
import { number } from "motion";

export interface IProduct{
    _id?:mongoose.Types.ObjectId;

    title:string;
    description:string;
    price:number;

    stock:number;
    isStockAvailable?:boolean;

    merchant:IUser;

    image1:string;
    image2:string;
    image3:string;
    image4:string;


    category:string;

    isWearable:boolean;
    size?:string[];

    verificationStatus : "pending" | "approved" | "rejected"
    requestedAt?: Date;
    approvedAt?:Date;
    rejectedReason?:string;

    isActive?:boolean;

    replacementDays?:number;
    freeDelivery?:boolean;
    warranty?:string;
    payOnDevelivery?:boolean;

    detailsPoint?: string[];

    reviews?:{
        user:IUser;
        rating:number;
        comment?:string;
        image?:string;
        createdAt?:Date
    }[];

    createdAt?: Date;
    updatedAt?: Date;
    }

const productSchema = new mongoose.Schema<IProduct>({

    title:{
        type:String, isRequired:true
    },
    description:{
        type:String, isRequired:true
    },
    price:{
        type:Number, isRequired:true
    },
    stock:{
        type:Number, isRequired:true
    },
    isStockAvailable:{
        type:Boolean, default:true
    },
    merchant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
     image1:{
        type:String, isRequired:true
    },
     image2:{
        type:String, isRequired:true
    },
     image3:{
        type:String, isRequired:true
    },
     image4:{
        type:String, isRequired:true
    },
     category:{
        type:String, isRequired:true
    },

     isWearable:{
        type:Boolean, default:false
    },
     size:{
        type:[String], default:[]
    },
    verificationStatus:{
        type:String,
        enum:["pending", "approved", "rejected"],
        default:"pending"
    },
    
    approvedAt:{
        type: Date
    },
    requestedAt:{
        type:Date
    },
    rejectedReason:{
        type:String
    },

    isActive:{
        type:Boolean, default:false
    },
    replacementDays:{
        type:number, 
        default:0
    },
    freeDelivery:{
        type:Boolean, 
        default:false
    },
    warranty:{
        type:String, 
        default:"No Warranty"
    },
    payOnDevelivery:{
        type:Boolean, 
        default:false
    },
    detailsPoint:{
        type:[String], 
        default:[]
    },


},{timestamps:true})