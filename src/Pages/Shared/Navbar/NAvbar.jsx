import React from 'react';
import { Link, NavLink } from 'react-router';
import Logo from '../../../Components/Logo/Logo';
import useAuth from '../../../Hooks/useAuth';

const NAvbar = () => {
    const { user, logOut } = useAuth()
    const handelLogOut = () => {
        logOut()
            .then()
            .catch(error => {
                console.log(error)
            })
    }
    console.log(user?.photoURL || 'not avilable')
    const links = <>
        <li><NavLink to={'/'} >Home</NavLink></li>
        <li><NavLink to={'/services'} >Services</NavLink></li>
        <li><NavLink to={'/'} >About</NavLink></li>
        <li><NavLink to={'/'} >Contact</NavLink></li>
        {/* <li><NavLink to={'/'} >About</NavLink></li> */}
        <li><NavLink to={'/send-percel'} >Send Percel</NavLink></li>
        <li><NavLink to={'/covarage'} >Covarage</NavLink></li>

        {
            user && <>
                <li><NavLink to={'/dashboard/my-parcels'} >My Parcels</NavLink></li>
                {/* <li><NavLink to={'/dashboard'} >Dashboard</NavLink></li> */}
            </>
        }
    </>
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <Link to={'/'} > <Logo></Logo> </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end">
                {
                    user && <Link to='/dashboard' className="btn" >Dashboard</Link>
                }
                {
                    user && <><details className="dropdown">
                        <summary className="btn m-1"><img className=' h-10 w-10 rounded-full border object-cover' src={user?.photoURL} alt="" /></summary>
                        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li> <Link className='btn'  >Profile</Link> </li>
                            {/* <li> <Link className='btn'  >Settings</Link> </li> */}
                            <li> <Link className='btn' onClick={handelLogOut}  >Log Out</Link> </li>

                        </ul>
                    </details></>
                }
                {
                    user ? "" : <Link className='btn' to='/login'>Log In </Link>
                }

                <Link className='btn btn-primary text-black' to='/be-decorator'>Be a Decorator</Link>
            </div>
        </div>
    );
};

export default NAvbar;