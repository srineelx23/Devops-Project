import {configureStore} from '@reduxjs/toolkit'
import budgetReducer from './slice/budgetSlice'
export const Store=configureStore({
    reducer:{
        budgetSliceReducer:budgetReducer
    }
})