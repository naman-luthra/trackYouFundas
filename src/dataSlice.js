import { createSlice } from '@reduxjs/toolkit'
import { loadHistory, sendData } from './dataThunks';

const initialState = {
    dataArray: [],
    status: 'idle'
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadHistory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadHistory.fulfilled, (state, action) => {
                state.dataArray = action.payload; 
                state.status = 'idle';
            })
            .addCase(sendData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendData.fulfilled, (state, action) => {
                if(state.dataArray.findIndex(day=>day._id===action.payload._id)===-1){
                    state.dataArray = [ ...state.dataArray, action.payload ]; 
                }
                else{
                    state.dataArray = state.dataArray.map(day=>{
                        if(day._id===action.payload._id)
                            return action.payload;
                        else return day;
                    })
                }
                state.status = 'idle';
            })
    },
})

export const dataArray = state=>state.data.dataArray;

export default dataSlice.reducer;