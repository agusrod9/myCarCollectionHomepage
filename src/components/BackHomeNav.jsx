import styles from './BackHomeNav.module.css'
import { Home } from "lucide-react"
import { useNavigate } from "react-router"

export default function BackHomeNav(){
    const navigate = useNavigate()

    const handleBackHomeNav = ()=>{
        navigate('/')
    }

    return(
        <div className={styles.backHomeContainer} onClick={handleBackHomeNav}>
            <Home />
            <p>Go back home</p>
        </div>
    )
}