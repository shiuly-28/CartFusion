
import { createSlice } from '@reduxjs/toolkit';
import { IUser } from './../model/user.model';
interface IUserData {
     AllMerchantData : IUser[]
}

const initialState: IUserData = {
     AllMerchantData : []
}

const merchantSlice = createSlice({
    name: "merchant",
    initialState,
    reducers: {
        setAllMerchantData: (state, action)=>{
            state. AllMerchantData = action.payload
        }
    }
})

export const {setAllMerchantData} = merchantSlice.actions
export default merchantSlice.reducer