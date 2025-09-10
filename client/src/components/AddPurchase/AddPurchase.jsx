import React from 'react'
import "./AddPurchase.css"
import axios from 'axios'
import {useForm} from 'react-hook-form'
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';

function AddPurchase() {
  let {register,handleSubmit}=useForm()
  let token=sessionStorage.getItem('token')
  const axioswithtoken=axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers:{Authorization: `Bearer ${token}`}
  })
  let navigate=useNavigate()
  let {currentUser}=useSelector(state=>state.budgetSliceReducer)
    const now = new Date()
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)


  async function formHandleSubmit(purObj){
    const localDate = new Date(purObj.date); // converts local to Date object
  const isoUTC = localDate.toISOString(); // converts to '2025-06-22T14:50:37.192Z'
  purObj.price=Number(purObj.price) 

  const purchaseToSend = {
    purchaseHistory:{
    ...purObj,
    date: isoUTC
    }
  };
  purchaseToSend.username=currentUser.username
  const result=await axioswithtoken.post('/user-api/add-purchase',purchaseToSend)
  if(result.data.message==='purchase inserted successfully'){
    toast.success("Purchase Added")
    navigate('/user-dashboard')
  }
  }
  return (
    <div className='p-2 d-flex justify-content-center align-items-center mt-5'>
      <div className='glass-car p-4'>
        <h4>Add Purchase</h4>
        <form action="" onSubmit={handleSubmit(formHandleSubmit)}>
            <div className='mb-2'>
            <label htmlFor="purchase-name" className='form-label'>Purchase Name</label>
            <input type="text" name="purchase-name" id="purchase-name" className='form-control' {...register("purchase_name",{required:true})}/>
            </div>
            <div className='mb-2'>
                <label htmlFor="price" className='form-label'>Price</label>
                <input type="number" name="price" id="price" className='form-control' {...register("price",{required:true})}/>
            </div>
            <div className='mb-2'>
                <label htmlFor="category" className='form-label'>Select Category</label>
                <select name="category" id="category" className='form-select'{...register("category",{required:true})}>
                    <option value="Food">Food</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Education">Education</option>
                    <option value="Savings & Investments">Savings & Investments</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Others">Others</option>
                </select>
            </div>
            <div className='mb-2'>
                <label htmlFor="Date" className='form-label'>Date</label>
                <input type="datetime-local" name="Date" id="Date" className='form-control' defaultValue={localDateTime} {...register("date",{required:true})}/>
            </div>
            <button type="submit" className='btn btn-success'>Add Purchase</button>
        </form>
      </div>
    </div>
  )
}

export default AddPurchase
