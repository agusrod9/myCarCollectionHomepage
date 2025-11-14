import './HomeScreen.css'
import { Header } from '../components/Header.jsx'
import { DashBoard } from '../components/DashBoard.jsx'
import { useContext} from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'

export function HomeScreen(){
    const {handleLogOut, userCarCount, userCarsValue,recentlyAddedCars, loggedUserId, loggedUserName, loggedUserProfilePicture} = useContext(AppContext)
    const navigate = useNavigate()
    const handleAddCarBtnClick = ()=>{
        navigate('/newCar')
    }

    return(
        <section className='homeBody'>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={handleLogOut}/>
            <div className='main'>
                <DashBoard userCarCount={userCarCount} userCarsValue={userCarsValue} handleAddCarBtnClick= {handleAddCarBtnClick} recentlyAddedCars={recentlyAddedCars}/>
            </div>
        </section>
    )
}