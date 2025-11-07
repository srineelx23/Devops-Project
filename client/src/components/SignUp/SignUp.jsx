import React from 'react'
import "./SignUp.css"
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import axios from 'axios'
function SignUp() {
    let {register,handleSubmit,formState:{errors}}=useForm()
    let navigate=useNavigate()
    let [errmsg,seterrmsg]=useState()
    let {errMsg}=useSelector(state=>state.budgetSliceReducer)
    async function formHandleSUbmit(userObj){
      userObj.dailyBudget={}
      userObj.monthlyBudget={}
      userObj.weeklyBudget={}
      userObj.customBudget={}
      let res=await axios.post('http://localhost:4000/user-api/user',userObj)
      if(res.data.message==='user successfully created'){
        navigate('/signin')
      }
      else{
        seterrmsg(res.data.message)
      }
    }
  return (
    <div className='text-white p-2'>
        <div className='w-50 mx-auto mt-5 glass-card text-center'>
        <h4 style={{color:"rgb(1, 60, 23)"}}>Register</h4>
        <div>
            <form action="" className='w-75 mx-auto' onSubmit={handleSubmit(formHandleSUbmit)}>
            <div className='username mb-3'>
                 <input type="text" name="username" id="username" placeholder='Username'className='form-control'{...register("username",{required:true})} autoComplete='...'/>
            </div>
            {errors.username?.type==='required' && (<p className='fw-bold fs-5  ' style={{color:"#ff4d4f"}}>Enter Username</p>)}
            <div className='e-mail mb-3'>
                <input type="email" name="email" id="email" placeholder='E-mail'className='form-control'{...register("email",{required:true})}autoComplete='...'/>
            </div>
            {errors.email?.type==='required' && (<p className='fw-bold fs-5  ' style={{color:"#ff4d4f"}}>Enter E-mail</p>)}
            <div className='password mb-3'>
                <input type="password" name="password" id="password" placeholder='Password'className='form-control'{...register("password",{required:true})}autoComplete='...'/>
            </div>
            {errors.password?.type==='required' && (<p className='fw-bold fs-5  ' style={{color:"#ff4d4f"}}>Enter Password</p>)}
            {errmsg?.length>0 && (<p className='fw-bold fs-4 text-danger'>{errmsg}</p>)}
            <button type="submit" className='btn btn-primary'>Register</button>
      </form>
        </div>
        </div>
    </div>
  )
}

export default SignUp
