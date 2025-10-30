import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UsersState {
    email: string;
    id: string;
    role: string;
    full_name: string;
}

const initialState: UsersState = {
    email: '',
    id: '',
    role: '',
    full_name: '',
};


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (
            state,
            action: PayloadAction<{
                email: string;
                id: string;
                role: string;
                full_name?: string;
            }>
        ) => {
            state.email = action.payload.email;
            state.id = action.payload.id;
            state.role = action.payload.role;
            if (action.payload.full_name) {
                state.full_name = action.payload.full_name;
            }
        },
        resetUser: () => initialState,
    }
})

export const {updateUser, resetUser} = userSlice.actions;

export default userSlice.reducer;