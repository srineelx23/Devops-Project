import React from 'react'
import NavigatBar from '../NavigatBar/NavigatBar'
import Footer from '../Footer/Footer'
import {Outlet} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect,useRef } from 'react'
import { useDispatch } from 'react-redux'
import "./RootLayout.css"
import { checkAuth } from '../../reduc/slice/budgetSlice'
import SkeletonScreen from '../SkeletonScreen/SkeletonScreen'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function RootLayout() {
  
  const attemptedAuthRef = useRef(false)
  let dispatch=useDispatch()
  const token=sessionStorage.getItem('token')
  const { currentUser,isPending,loginUserStatus } = useSelector(state => state.budgetSliceReducer);
  const authCheckInProgress = token && isPending && !loginUserStatus;

  useEffect(() => {
    // If there's no user in Redux but token is still present, remove it
    // console.log(currentUser)
    // const token=localStorage.getItem('token')
    if (token && !loginUserStatus && !isPending && !attemptedAuthRef.current) {
      attemptedAuthRef.current = true
      dispatch(checkAuth())
    }
  }, [dispatch,loginUserStatus,isPending]);

  if(authCheckInProgress){
    return <SkeletonScreen/>
  }


  return (
    <div className={loginUserStatus ? 'back':'main'}>
      <NavigatBar></NavigatBar>
       <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} />
      <div className={loginUserStatus ? 'back1':'dynam'} >
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default RootLayout
