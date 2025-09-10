import { useState } from 'react'
import './Header.css'
import { ChevronDown, ChevronUp, User, Car, Cog, LogOut } from 'lucide-react'
import { MenuItem } from './MenuItem'
import { useNavigate } from 'react-router-dom'

export function Header({loggedUserId,loggedUserName, handleLogOut}){

    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const navigate = useNavigate()
    
    return(
        <section>
            <div className='header'>
                    <div className='homeLink' onClick={()=>navigate('/')}>
                        <img src="/wc.png" alt="Logotipo de WeCollect" />
                    </div>
                    <div className='headerProfileContainer' onClick={()=>setMenuIsOpen(!menuIsOpen)}>
                        <img src="https://avatar.iran.liara.run/public/boy" alt={`Profile picture of ${loggedUserName}`} className='headerProfilePic'/>
                        <span className='headerProfileUserName'>{loggedUserName}</span>
                        {menuIsOpen ? <ChevronUp /> : <ChevronDown />}
                    </div>   
            </div>
            {menuIsOpen ? 
                <div className='headerMenu'>
                    <MenuItem icon={<User />} text="Profile" onClick={()=>{navigate('/profile')}}/>
                    <MenuItem icon={<Car />} text="My Collections"/>
                    <MenuItem icon={<Cog />} text="Configuration"/>
                    <MenuItem icon={<LogOut />} text="Log out" onClick={()=>handleLogOut()}/>
                </div> 
                : null
            }
        </section>
    )
}