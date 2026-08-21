
import { createSlice } from '@reduxjs/toolkit';
import { IUser } from './../model/user.model';
interface IUserData {
    userData : IUser | null
}

const initialState: IUserData = {
    userData : null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action)=>{
            state.userData = action.payload
        }
    }
})

export const {setUserData} = userSlice.actions
export default userSlice.reducer