import React from 'react'
import "./UserDashBoard.css"
import { NavLink } from 'react-router-dom'
import { MdCalendarMonth } from "react-icons/md";
import { FaCalendarWeek } from "react-icons/fa6";
import { PiNumberCircleOneBold } from "react-icons/pi";
import { Outlet } from 'react-router-dom';
import { TbPencilDollar } from "react-icons/tb";

function UserDashBoard() {
  return (
    <div className='p-3 m-0'>
        <div className='navigat d-flex w-50 mx-auto justify-content-around flex-wrap mb-2'>
            <NavLink className='dashboard-link nav-link' to="monthly-budget"><MdCalendarMonth />Monthly Budget</NavLink>
            <NavLink className='dashboard-link nav-link' to="weekly-budget"><FaCalendarWeek />Weekly budget</NavLink>
            <NavLink className='dashboard-link nav-link' to="daily-budget"><PiNumberCircleOneBold />Daily Budget</NavLink>
            <NavLink className='dashboard-link nav-link' to="custom-budget"><TbPencilDollar/>Custom Budget</NavLink>
        </div>
        <Outlet></Outlet>
    </div>
  )
}

export default UserDashBoard
