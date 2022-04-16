import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    filterStr: null
};


const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter(state, action){
            const str = action.payload;

            console.log("in sss", str)

            const newState = {
                ...state,
                filterStr: str
            };

            return newState
        },
        clearFilter(state, action){
            return initialState
        }
    }
});

export const {clearFilter, setFilter} = filterSlice.actions;
export default filterSlice.reducer;