import { useContext, useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styles from  './MyGarageScreen.module.css'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import { SearchBar } from '../components/SearchBar'
import { CarCard } from '../components/CarCard'

export function MyGarageScreen(){
    const {loggedUserId, loggedUserName, loggedUserProfilePicture, handleLogOut} = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const [userCollectedCars, SetUserCollectedCars] = useState([])

    useEffect(()=>{
        const getUsercollectedCars =async()=>{
            const url = `https://mycarcollectionapi.onrender.com/api/cars?userId=${loggedUserId}`
            const response = await fetch(url)
            const responseData = await response.json()
            SetUserCollectedCars(responseData.data)
        }
        getUsercollectedCars()
    },[])

    function handleSearch(query){
        alert(query)
    }

    if(loading){return <Loading/>}
    return(
        <section className={styles.root}>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={handleLogOut}/>
            <div className={styles.myGarageContainer}>
                <div className={styles.myGFilters}>Filters</div>
                <SearchBar className={styles.myGSearchBar} title='My Garage' handleSearch={handleSearch}/>
                <div className={styles.myGMain}>
                    {
                        userCollectedCars.map(car=> CarCard(car))
                    }
                </div>
            </div>
        </section>
    )
}