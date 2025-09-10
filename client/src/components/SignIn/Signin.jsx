import React from 'react'
import {useForm} from 'react-hook-form'
import { useDispatch,useSelector } from 'react-redux'
import { useState } from 'react'
import "./Signin.css"
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userLoginthunk } from '../../reduc/slice/budgetSlice'
function Signin() {
  let navigate=useNavigate()
  let {currentUser,loginUserStatus,errMsg}=useSelector(state=>state.budgetSliceReducer)
  const [showError, setShowError] = useState(true)
  useEffect(()=>{
    if(loginUserStatus){
      setShowError(false)
      navigate('/user-dashboard')
    }
    return () => setShowError(false)
  },[loginUserStatus,navigate])
  let dispatch=useDispatch()
     let {register,handleSubmit,formState:{errors}}=useForm()
        function formHandleSUbmit(userObj){
          setShowError(true)
            dispatch(userLoginthunk(userObj))
        }
  return (
    <div className='text-white p-2'>
        <div className='w-50 mx-auto mt-5 glass-card text-center'>
        <h4 style={{color:"rgb(1, 60, 23)"}}>Login</h4>
        <div>
            <form action="" className='w-75 mx-auto' onSubmit={handleSubmit(formHandleSUbmit)}>
            <div className='username mb-3'>
                 <input type="text" name="username" id="username" placeholder='Username'className='form-control'{...register("username",{required:true})}autoComplete='...'/>
            </div>
            {errors.username?.type==='required' && (<p className='fw-bold fs-5  ' style={{color:"#ff4d4f"}}>Enter Username</p>)}
            <div className='password mb-3'>
                <input type="password" name="password" id="password" placeholder='Password'className='form-control'{...register("password",{required:true})}autoComplete='...'/>
            </div>
            {errors.username?.type==='required' && (<p className='fw-bold fs-5  ' style={{color:"#ff4d4f"}}>Enter Password</p>)}
            {showError && errMsg.length>0 && (<p className='text-danger fw-bold lead'>{errMsg}</p>)}
            <button type="submit" className='btn btn-success'>Login</button>
      </form>
        </div>
        </div>
    </div>
  )
}

export default Signin
