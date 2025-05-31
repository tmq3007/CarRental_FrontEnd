import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UsersState {
    email: string,
    id: string,
    role: string,
}

const initialState: UsersState = {
    email: '',
    id: '',
    role: '',
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state,
                     action: PayloadAction<{
                         email: string,
                         id: string,
                         role: string,
                     }>) => {
            state.email = action.payload.email;
            state.id = action.payload.id;
            state.role = action.payload.role;
        },
        resetUser: () => initialState,
    }
})

export const {updateUser, resetUser} = userSlice.actions;

export default userSlice.reducer;