import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './MonthlyBudget.css'
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios'
import {
  Cell, Tooltip, Legend, BarChart, Bar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { toast } from 'react-toastify';
import SkeletonScreen from '../SkeletonScreen/SkeletonScreen'

function MonthlyBudget() {

  function groupByCategory(purchases) {
    if (!Array.isArray(purchases)) return [];
    const categoryMap = {};
    purchases.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + p.price;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: '2-digit', timeZone: 'UTC'
    });
  }

  function getSpendingOverTime(purchases) {
    if (!Array.isArray(purchases)) return [];
    const dateMap = {};
    purchases.forEach(p => {
      const date = formatDate(p.date);
      dateMap[date] = (dateMap[date] || 0) + p.price;
    });
    return Object.entries(dateMap).map(([date, value]) => ({ date, value }));
  }



  const { currentUser } = useSelector(state => state.budgetSliceReducer);
  const token = sessionStorage.getItem('token');
  const [user, setUser] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  const axioswithtoken = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

   async function getData() {
      try {
        const result = await axioswithtoken.get(`/user-api/view-monthly-budget/${currentUser.username}`);
        setUser(result.data.user);
        setPurchases(result.data.payload);
        setTotalSpent(result.data.totalSpent);
      } catch (err) {
        console.log("Error Fetching data", err);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    getData();
  }, [currentUser.username]);


  async function handleDelete(purchase){
    // console.log("delete function called")
     try {
    const res = await axioswithtoken.delete(
      `/user-api/delete-purchase/${currentUser.username}`,
       {
    data: {
      purchase_name: purchase.purchase_name,
      price: purchase.price,
      category: purchase.category,
      date: purchase.date
    }
  }// sending body for DELETE
    );
    // console.log(res)
    if (res.data.message === 'Purchase Deleted') {
      toast.error("Purchase Deleted")
      await getData()
    }
  } catch (err) {
    console.error('Error deleting purchase', err);
  }
  }

  if (loading || !currentUser) return <SkeletonScreen />

  const categoryData = groupByCategory(purchases);
  const lineChartData = getSpendingOverTime(purchases);
  const COLORS = ['#1b5e20', '#004d40', '#37474f', '#3e2723', '#263238'];
  const budget = user?.monthlyBudget?.budget || 0;

  return (
    <div>
      <div className='gc w-75 mx-auto glass-card'>
        <div className='row justify-content-around p-0'>
          {Object.keys(user?.monthlyBudget || {}).length === 0 ? <h4>No Budget Set</h4> : <>
            <div className='col-12 col-md-6 col-lg-4 mb-4'>
              {
                totalSpent <= budget ?
                  (budget - totalSpent <= 500 ?
                    <h5 className='text-warning'>You are approaching your monthly budget limit.</h5> :
                    <h5 className='text-success'>Your spending is within the allocated budget.</h5>)
                  : <h5 className='text-danger'>You have exceeded your monthly budget.</h5>
              }
              <h5>Your Monthly Budget: ₹{budget}</h5>
              <h5>Your Total Expenditure: ₹{totalSpent}</h5>
              <h5>From: {formatDate(user.monthlyBudget.startDate)}</h5>
              <h5>To: {formatDate(user.monthlyBudget.endDate)}</h5>
            </div>

            <div className='col-12 col-md-6 col-lg-4 mb-4'>
              <h5 className="text-center">Category-wise Spending</h5>
              {purchases.length > 0 ?
                <div className="graph-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData} margin={{ top: 30, right: 30, left: 10, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fill: "#fff", fontWeight: 'bold' }} interval={0} angle={-25} textAnchor="end" />
                      <YAxis tick={{ fill: "#fff", fontWeight: 'bold' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#fff' }} />
                      <Bar dataKey="value" fill="#8884d8">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div> : <h4 className='text-center'>No purchases made</h4>}
            </div>

            <div className='col-12 col-md-6 col-lg-4 mb-4'>
              <h5 className="text-center">Spending Over Time</h5>
              {purchases.length > 0 ?
                <div className="graph-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineChartData} margin={{ top: 30, right: 30, left: 10, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fill: '#ffffff', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#ffffff', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#00A36C" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div> : <h4 className='text-center'>No purchases made</h4>}
            </div>
          </>}
        </div>
      </div>

      <div className='gc w-75 mt-4 mx-auto glass-card'>
        <h3>Purchases List</h3>
        {Object.keys(purchases || {}).length === 0 ? <h1>No Purchases Made</h1> :
          <div className='table-container'>
            <table className='ctable'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Date and Time</th>
                  <th>Delete Purchase</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <tr key={index}>
                    <td>{purchase.purchase_name}</td>
                    <td>{purchase.price}</td>
                    <td>{purchase.category}</td>
                    <td>{formatDate(purchase.date)}</td>
                    <td><button className="btn btn-danger" onClick={()=>handleDelete(purchase)}><MdDeleteForever /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}

export default MonthlyBudget;
