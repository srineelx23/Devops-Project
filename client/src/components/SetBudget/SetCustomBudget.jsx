import React from 'react'
import { useSelector } from 'react-redux'
import {useForm} from 'react-hook-form'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import SkeletonScreen from '../SkeletonScreen/SkeletonScreen'
import { toast } from 'react-toastify';

function SetCustomBudget() {
   let {currentUser}=useSelector(state=>state.budgetSliceReducer)

    const { register, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(true);
    
    const token=sessionStorage.getItem('token')
  const axioswithtoken = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

    let navigate=useNavigate()


    async function FormHandleSubmit(budgetObj){
    budgetObj.budget=Number(budgetObj.budget)
    budgetObj.startDate=new Date(budgetObj.startDate).toISOString()
    budgetObj.endDate=new Date(budgetObj.endDate).toISOString()
    // console.log(budgetObj)
    const res=await axioswithtoken.post(`/user-api/set-custom-budget/${currentUser.username}`,budgetObj)
    if(res.data.message==='Budget Updated'){
      toast.success("Custom Budget Updated Successfully")
        navigate('/user-dashboard/custom-budget')
    }
}


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

  return (
     <div className='p-2'>
      <div className='glass-car mx-auto p-3 m-5 text-white'>
        <h3>Add Your Custom Budget</h3>
        <form action="" className='w-75' onSubmit={handleSubmit(FormHandleSubmit)}>
            <label htmlFor="budget" className='form-label'>Enter Budget Amount</label>
            <input type="number" id="budget" className='form-control'{...register("budget",{required:true})} defaultValue={currentUser.monthlyBudget.budget}  />
            <label htmlFor="todaydate" className='form-label'>Start Date</label>
            <input type="date" name="todaydate" id="todaydate" className='form-control' {...register("startDate",{required:true})}/>
            <label htmlFor="enddate" className='form-label'>End Date</label>
            <input type="date" id="enddate" className='form-control'{...register("endDate",{required:true})}/>
            <button type="submit" className='btn btn-primary mt-4 text-center'>Add Custom Budget</button>
        </form>
      </div>
    </div>
  )
}

export default SetCustomBudget
