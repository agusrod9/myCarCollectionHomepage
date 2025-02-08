import './Header.css'
import { NavLink } from 'react-router'

export function Header({loggedUserId}){
    
    if(!loggedUserId){
        return(
            <div className='header'>
            <nav className='navBar'>
                <NavLink to={'/login'} className='navBarLink'>
                    Login
                </NavLink>
                <NavLink to={'/register'} className='navBarLink'>
                    Register
                </NavLink>
            </nav>
        </div> 
        )
    }

    return(
        <div className='header'>
            <nav className='navBar'>
                <NavLink to={'/'} className='navBarLink navBarHomeLink'>
                    <img src="/wc.png" alt="" />
                </NavLink>
                <NavLink to={'/newCar'} className='navBarLink'>
                    Add new Car
                </NavLink>
                <NavLink to={'/resetPass'} className='navBarLink'>
                    Reset Password
                </NavLink>
                <NavLink to={'/profile'} className='navBarLink'>
                    Profile
                </NavLink>
            </nav>
        </div>   
    )
}