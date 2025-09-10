import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import RootLayout from './components/RootLayout/RootLayout'
import SignUp from './components/SignUp/SignUp'
import Signin from './components/SignIn/Signin'
import Home from './components/Home/Home'
import UserDashBoard from './components/UserDashBoard/UserDashBoard'
import DailyBudget from './components/DailyBudget/DailyBudget'
import WeeklyBudget from './components/WeeklyBudget/WeeklyBudget'
import MonthlyBudget from './components/MonthlyBudget/MonthlyBudget'
import AddPurchase from './components/AddPurchase/AddPurchase'
import SetDailyBudget from './components/SetBudget/SetDailyBudget'
import SetWeeklyBudget from './components/SetBudget/SetWeeklyBudget'
import SetMonthlyBudget from './components/SetBudget/SetMonthlyBudget'
import CustomBudget from './components/CustomBudget/CustomBudget'
import SetCustomBudget from './components/SetBudget/SetCustomBudget'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {

  let router=createBrowserRouter([
    {
      path:'',
      element:<RootLayout/>,
      children:[
        {
          path:'/',
          element:<Home/>
        },
        {
          path:'signup',
          element:<SignUp/>
        },
        {
          path:'signin',
          element:<Signin/>
        },
        {
          path:'user-dashboard',
          element:<ProtectedRoute>
      <UserDashBoard />
    </ProtectedRoute>,
          children:[
            {
              path:'daily-budget',
              element:<DailyBudget/>
            },
            {
              path:'weekly-budget',
              element:<WeeklyBudget/>
            },
            {
              path:'monthly-budget',
              element:<MonthlyBudget/>
            },
            {
              path:'custom-budget',
              element:<CustomBudget/>
            }
          ]
        },
        {
          path:'add-purchase',
          element:<ProtectedRoute>
      <AddPurchase />
    </ProtectedRoute>
        },
        {
          path:'set-daily-budget',
          element:<ProtectedRoute>
      <SetDailyBudget />
    </ProtectedRoute>
        },
        {
          path:'set-weekly-budget',
          element:<ProtectedRoute>
      <SetWeeklyBudget />
    </ProtectedRoute>
        },
        {
          path:'set-monthly-budget',
          element:<ProtectedRoute>
      <SetMonthlyBudget />
    </ProtectedRoute>
        },
        {
          path:'set-custom-budget',
          element:<ProtectedRoute>
      <SetCustomBudget />
    </ProtectedRoute>
        }
      ]
    }
  ])

  return (
    <>
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
    </>
  )
}

export default App
