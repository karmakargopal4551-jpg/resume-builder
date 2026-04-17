import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../app/features/authSlice'


const Navbar = () => {

    const { user } = useSelector(state => state.auth)

    const dispatchEvent = useDispatch()

    const navigate = useNavigate()

    const logoutUser = () => {
        localStorage.removeItem("token")
        navigate('/')
        dispatchEvent(logout())
    }

  return (
    <div className='shadow bg-white'>
        <nav className='flex place-items-center justify-between max-w-7xl max-auto px-4 py-3.5 text-slate-800 transition-all'>
            <Link to='/'>
                <img src="/logo.svg" alt="logo" className='w-12' />
            </Link>

            <div className='flex item-center gap-4 text-sm'>
                <p>Hi, {user.name}</p>
                <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-400 px-7 py-1.5 rounded-full active:bg-slate-200 transition-all'>Logout</button>
            </div>
        </nav>
      
    </div>
  )
}

export default Navbar