import { useLocation } from 'react-router'
import styles from './CarDetailsScreen.module.css'
import { Header } from '../components/Header'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export function CarDetailsScreen(){
    const location = useLocation()
    const {loggedUserId, loggedUserProfilePicture, loggedUserName, handleLogOut} = useContext(AppContext)
    const car = location.state?.car
    return(
        <span className={styles.screen}>
            <Header loggedUserId={loggedUserId} loggedUserProfilePicture={loggedUserProfilePicture} loggedUserName={loggedUserName} handleLogOut={handleLogOut}/>
            <div className={styles.container}>
                <div className={styles.imagesContainer}>
                    <p>Imágenes</p>
                </div>
                <div className={styles.infoContainer}>
                    <p>Info</p>
                </div>

            </div>
        </span>
    )
}