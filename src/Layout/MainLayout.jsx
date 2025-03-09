import React from 'react'
import Header from '../Component/Common/Header'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className='mg-auto'>
        <Header/>
        <div>
        <Outlet/>
        </div>
    </div>
  )
}
