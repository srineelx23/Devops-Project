import {createSlice} from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
export const userLoginthunk=createAsyncThunk('user-login',async(usercredObj,thunkApi)=>{
    try{
        const res=await axios.post('http://localhost:4000/user-api/login',usercredObj)
    if(res.data.message==='Login successful'){
        sessionStorage.setItem('token',res.data.token)
        return res.data;
    }
    else{
        return thunkApi.rejectWithValue(res.data.message)
    }
    }
    catch(err){
        return thunkApi.rejectWithValue(err)
    }
})


export const checkAuth=createAsyncThunk('user-reload',async(_,thunkApi)=>{
    try{
    let token=sessionStorage.getItem('token')
  const axioswithtoken = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });
    const response=await axioswithtoken.get('/user-api/reload')
    if(response.data.message==='user sent'){
        // console.log(response)
        return response.data;
    }
    }
    catch(err){
        return thunkApi.rejectWithValue(err)
    }
})



export const budgetSlice=createSlice({
    name:"budget-slice",
    initialState:{
        isPending:false,
        loginUserStatus:false,
        currentUser:{},
        errorOccurred:false,
        errMsg:''
    },
    reducers:{
         resetState:(state,action)=>{
            state.isPending=false;
            state.loginUserStatus=false;
            state.currentUser={};
            state.errorOccurred=false;
            state.errMsg='';
         }
    },
    extraReducers:(builder)=>{
        builder.addCase(userLoginthunk.pending,(state,action)=>{
            state.isPending=true
        })
        .addCase(userLoginthunk.fulfilled,(state,action)=>{
            state.isPending=false,
            state.loginUserStatus=true,
            state.currentUser=action.payload.user,
            state.errorOccurred=false,
            state.errMsg=''
        })
        .addCase(userLoginthunk.rejected,(state,action)=>{
            state.isPending=false,
            state.loginUserStatus=false,
            state.currentUser={},
            state.errorOccurred=true,
            state.errMsg=action.payload
        })
        .addCase(checkAuth.pending,(state,action)=>{
            state.isPending=true
        })
        .addCase(checkAuth.fulfilled,(state,action)=>{
            state.isPending=false;
            state.currentUser=action.payload.user
            state.loginUserStatus=true;
            state.errMsg='';
            state.errorOccurred=false;
        })
        .addCase(checkAuth.rejected,(state,action)=>{
            state.isPending=false;
            state.currentUser={};
            state.loginUserStatus=false;
            state.errMsg=action.payload;
            state.errorOccurred=true;
        })
    }
})

export default budgetSlice.reducer
export const {resetState} =budgetSlice.actions