import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UsersState {
    username: string,
    id: string,
    role: string,
}

const initialState: UsersState = {
    username: '',
    id: '',
    role: '',
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state,
                     action: PayloadAction<{
                         username: string,
                         id: string,
                         role: string,
                     }>) => {
            state.username = action.payload.username;
            state.id = action.payload.id;
            state.role = action.payload.role;
        },
        resetUser: () => initialState,
    }
})

export const {updateUser, resetUser} = userSlice.actions;

export default userSlice.reducer;