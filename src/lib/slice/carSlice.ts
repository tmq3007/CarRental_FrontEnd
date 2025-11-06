import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarState {
    id: string;
}

const initialState: CarState = {
    id: '',
};

const carSlice = createSlice({
    name: 'car',
    initialState,
    reducers: {
        setCarId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        resetCarId: () => initialState,
    },
});

export const { setCarId, resetCarId } = carSlice.actions;

export default carSlice.reducer;
