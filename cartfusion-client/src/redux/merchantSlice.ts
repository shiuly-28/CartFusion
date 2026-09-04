import { IProduct } from './../model/product.model';

import { createSlice } from '@reduxjs/toolkit';
import { IUser } from './../model/user.model';
interface IUserData {
     AllMerchantData : IUser[],
     allProductData : IProduct[]
}

const initialState: IUserData = {
     AllMerchantData : [],
     allProductData : []
}

const merchantSlice = createSlice({
    name: "merchant",
    initialState,
    reducers: {
        setAllMerchantData: (state, action)=>{
            state. AllMerchantData = action.payload
        },
        setAllProductData: (state, action)=>{
            state. allProductData = action.payload
        },
    }
})

export const {setAllMerchantData} = merchantSlice.actions
export const {setAllProductData} = merchantSlice.actions
export default merchantSlice.reducer