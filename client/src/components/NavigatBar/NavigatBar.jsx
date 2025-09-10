import React from 'react'
import "./NavigatBar.css"
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { resetState } from '../../reduc/slice/budgetSlice'
function NavigatBar() {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  function SignOut(){
    sessionStorage.removeItem('token');
    dispatch(resetState())
  }

  function handleDropdownClose() {
    const dropdownToggle = document.querySelector('[data-bs-toggle="dropdown"]');
  if (dropdownToggle) {
    dropdownToggle.click();
  }
}

  const {loginUserStatus,currentUser}=useSelector(state=>state.budgetSliceReducer)
  return (
    <div className='navi '>
        <ul className='nav justify-content-end m-0 p-0 gap-3 me-2'>
          {loginUserStatus===false?<>
             <li className="nav-item">
            <NavLink className='nav-link custom-link' style={{"color":"rgb(255, 255, 255)"}}  to="/">Home</NavLink>
        </li>
        <li className='nav-item'>
            <NavLink className='nav-link' style={{"color":"rgb(255, 255, 255)"}} to="signup">Sign Up</NavLink>
        </li>
        <li className='nav-item'>
            <NavLink className='nav-link' style={{"color":"rgb(255, 255, 255)"}} to="signin">Sign In</NavLink>
        </li></>:<>
        <div className='d-flex justify-content-between w-100 align-items-center '>
          <NavLink className='money-text ms-0' to='user-dashboard' style={{color:"darkgreen"}}>Welcome {currentUser.username}</NavLink>
          <div className='d-flex'>
           <li className='nav-item me-1'> <NavLink className='nav-link' to='add-purchase' style={{"color":"rgb(255, 255, 255)"}}>Add Purchase</NavLink></li>
           <li className="nav-item dropdown me-1">
                <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Set Budget
                </a>
                <ul className="dropdown-menu glass-dropdown">
                  <li><NavLink className="dropdown-item" to="set-daily-budget" onClick={handleDropdownClose}>Daily Budget</NavLink></li>
                  <li><NavLink className="dropdown-item" to="set-weekly-budget" onClick={handleDropdownClose}>Weekly Budget</NavLink></li>
                  <li><NavLink className="dropdown-item" to="set-monthly-budget" onClick={handleDropdownClose}>Monthly Budget</NavLink></li>
                  <li><NavLink className="dropdown-item" to="set-custom-budget">Custom Budget</NavLink></li>
                </ul>
              </li>
            <li className='nav-item me-1'><NavLink className='nav-link' to="/" style={{"color":"rgb(255, 255, 255)"}} onClick={SignOut}>Sign Out</NavLink></li>
          </div>
        </div>
        </>
      }
        </ul>
    </div>
  )
}

export default NavigatBar
