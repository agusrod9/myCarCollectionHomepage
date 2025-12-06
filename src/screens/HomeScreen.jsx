import styles from './HomeScreen.module.css'
import { Header } from '../components/Header.jsx'
import { DashBoard } from '../components/DashBoard.jsx'
import { useContext} from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle.js'

export function HomeScreen(){
    const {handleLogOut, userCarCount, userFavoritesCount, userCarsValue,recentlyAddedCars, loggedUserId, loggedUserName, loggedUserProfilePicture} = useContext(AppContext)
    const navigate = useNavigate()
    const handleAddCarBtnClick = ()=>{
        navigate('/newCar')
    }
    usePageTitle(`${loggedUserName}´s Home`)
    return(
        <section className={styles.root}>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut(true)}}/>
                <h2>Welcome <span className={styles.usrInTitle}>{loggedUserName}</span>!</h2>
            <div className={styles.main}>
                <DashBoard userCarCount={userCarCount} userCarsValue={userCarsValue} userFavoritesCount={userFavoritesCount} handleAddCarBtnClick= {handleAddCarBtnClick} recentlyAddedCars={recentlyAddedCars}/>
            </div>
        </section>
    )
}