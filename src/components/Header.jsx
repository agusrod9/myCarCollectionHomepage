import { useState } from 'react'
import styles from './Header.module.css'
import { ChevronDown, ChevronUp, User, Car, Cog, LogOut } from 'lucide-react'
import { MenuItem } from './MenuItem'
import { useNavigate } from 'react-router-dom'

export function Header({loggedUserName, handleLogOut, loggedUserProfilePicture}){

    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const navigate = useNavigate()
    
    return(
        <section>
            <div className={styles.header}>
                    <div className={styles.homeLink} onClick={()=>navigate('/')}>
                        <img src="/wc.png" alt="Logotipo de WeCollect" />
                    </div>
                    <div className={styles.headerProfileContainer} onClick={()=>setMenuIsOpen(!menuIsOpen)}>
                        <img src={ loggedUserProfilePicture || "https://avatar.iran.liara.run/public"} alt={`Profile picture of ${loggedUserName}`} className={styles.headerProfilePic}/>
                        <span className={styles.headerProfileUserName}>{loggedUserName}</span>
                        {menuIsOpen ? <ChevronUp /> : <ChevronDown />}
                    </div>   
            </div>
            {menuIsOpen ? 
                <div className={styles.headerMenu}>
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