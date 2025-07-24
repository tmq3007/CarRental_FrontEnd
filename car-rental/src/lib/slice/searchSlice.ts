// store/searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  province: string;
  district: string;
  ward: string;
}

interface SearchState {
  location: Location;
  pickupTime: string | null;
  dropoffTime: string | null;
}

const initialState: SearchState = {
  location: {
    province: '',
    district: '',
    ward: '',
  },
  pickupTime: new Date().toISOString(),
  dropoffTime: new Date().toISOString(),
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchData: (
      state,
      action: PayloadAction<{
        location: Location;
        pickupTime: string | null;
        dropoffTime: string | null;
      }>
    ) => {
      state.location = action.payload.location;
      state.pickupTime = action.payload.pickupTime;
      state.dropoffTime = action.payload.dropoffTime;
    },
  },
});

export const { setSearchData } = searchSlice.actions;
export default searchSlice.reducer;