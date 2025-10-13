import { useCallback, useContext, useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styles from  './MyGarageScreen.module.css'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import { SearchBar } from '../components/SearchBar'
import { CarCard } from '../components/CarCard'
import { toDo } from '../utils/toDo'
import { FiltersPanel } from '../components/FiltersPanel'

export function MyGarageScreen(){
    const {loggedUserId, loggedUserName, loggedUserProfilePicture, handleLogOut} = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    const [userCollectedCars, SetUserCollectedCars] = useState([])
    const [filteredCars, setFilteredCars] = useState([])
    const [selectedFilters, setSelectedFilters] = useState({
        availableManufacturers : [],
        availableCarMakes : [],
        availableScales : [],
        availablePrices : []
    })

    const FILTER_KEYS = {
        availableManufacturers : 'manufacturer',
        availableCarMakes : 'carMake',
        availableScales : 'scale',
        availablePrices : 'price'
    }

    function handleSearch(query){
        toDo(query)
    }

    const acBtnClick = useCallback((carId)=>{
        toDo(`Implementar navegación a nuevo layout para el auto con id: ${carId}`)
    },[])

    useEffect(()=>{
        const getUsercollectedCars =async()=>{
            const url = `https://mycarcollectionapi.onrender.com/api/cars?userId=${loggedUserId}`
            const response = await fetch(url)
            const responseData = await response.json()
            SetUserCollectedCars(responseData.data)
            setFilteredCars(responseData.data)
        }
        getUsercollectedCars()
        setLoading(!loading)
    },[])

    useEffect(()=>{
        
        const filteredCars = userCollectedCars.filter(car=>{
            for(const[key, values] of Object.entries(selectedFilters)){
                const carKey= FILTER_KEYS[key]

                if(!values || values.length===0) continue;

                if(!values.includes(car[carKey])){
                    return false;
                }
            }
            return true;
        })
        setFilteredCars(filteredCars)
    },[selectedFilters, userCollectedCars])

    if(loading){return <Loading/>}
    return(
        <section className={styles.root}>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={handleLogOut}/>
            <div className={styles.myGarageContainer}>
                <FiltersPanel className={styles.myGFilters} setSelectedFilters={setSelectedFilters} selectedFilters={selectedFilters}/>
                <SearchBar className={styles.myGSearchBar} title='My Garage' handleSearch={handleSearch}/>
                <div className={styles.myGMain}>
                    {
                        filteredCars.map(car=> <CarCard key={car._id} car={car} acBtnClick={acBtnClick}/>)
                    }
                </div>
            </div>
        </section>
    )
}