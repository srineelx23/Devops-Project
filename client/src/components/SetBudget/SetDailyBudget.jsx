import React from 'react'
import { useSelector } from 'react-redux'
import {useForm} from 'react-hook-form'
import { useEffect } from 'react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import SkeletonScreen from '../SkeletonScreen/SkeletonScreen'
import axios from 'axios'
import { toast } from 'react-toastify';


function SetDailyBudget() {
    let {currentUser}=useSelector(state=>state.budgetSliceReducer)

    const { register, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(true);
    const token=sessionStorage.getItem('token')

  const axioswithtoken = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

    let navigate=useNavigate()

    const getToday = () => {
    const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // ensure 2 digits
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // returns YYYY-MM-DD
  };


    useEffect(() => {
    // Wait until Redux loads
    if (currentUser || currentUser === null) {
      setLoading(false)
    }
  }, [currentUser])

  if (loading) return <SkeletonScreen />


  if (!currentUser || !currentUser.username) {
    return (
      <div className='text-center text-danger mt-5'>
        <h4>Please sign in to set your budget.</h4>
      </div>
    );
  }

async function FormHandleSubmit(budgetObj){
    budgetObj.budget=Number(budgetObj.budget)
    budgetObj.startDate=new Date(budgetObj.startDate).toISOString()
    const res=await axioswithtoken.post(`/user-api/set-daily-budget/${currentUser.username}`,budgetObj)
    if(res.data.message==='Budget Updated'){
      toast.success("Daily Budget Updated Successfully")
        navigate('/user-dashboard/daily-budget')
    }
}



  return (
    <div className='p-2'>
      <div className='glass-car mx-auto p-3 m-5 text-white'>
        <h3>Add Your Daily Budget</h3>
        <form action="" className='w-75' onSubmit={handleSubmit(FormHandleSubmit)}>
            <label htmlFor="budget" className='form-label'>Enter Budget Amount</label>
            <input type="number" className='form-control' id="budget"{...register("budget",{required:true})} defaultValue={currentUser.dailyBudget.budget || ''}/>
            <label htmlFor="todaydate" className='form-label'>Start Date</label>
            <input type="date" name="todaydate" id="todaydate" className='form-control' defaultValue={getToday()} {...register("startDate",{required:true})}/>
            <button type="submit" className='btn btn-primary mt-4 text-center'>Add Daily Budget</button>
        </form>
      </div>
    </div>
  )
}

export default SetDailyBudget
