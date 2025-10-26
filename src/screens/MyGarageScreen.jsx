import { useCallback, useContext, useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styles from  './MyGarageScreen.module.css'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import { SearchBar } from '../components/SearchBar'
import { CarCard } from '../components/CarCard'
import { FiltersPanel } from '../components/FiltersPanel'
import { useNavigate } from 'react-router'

export function MyGarageScreen(){
    const {loggedUserId, loggedUserName, loggedUserProfilePicture, handleLogOut, userCollectedCars, setUserCollectedCars} = useContext(AppContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [filteredCars, setFilteredCars] = useState([])
    const [selectedFilters, setSelectedFilters] = useState({
        availableManufacturers : [],
        availableCarMakes : [],
        availableScales : [],
        availablePrices : [],
        query:""
    })

    const FILTER_KEYS = {
        availableManufacturers : 'manufacturer',
        availableCarMakes : 'carMake',
        availableScales : 'scale',
        availablePrices : 'price'
    }

    function handleSearch(q){
        setSelectedFilters(prev=>({
            ...prev,
            query: q
        }))
    }

    const acBtnClick = useCallback((car)=>{
        navigate('/details', {state: {car}})
    },[])

    useEffect(()=>{
        const getUsercollectedCars =async()=>{
            const url = `https://mycarcollectionapi.onrender.com/api/cars?userId=${loggedUserId}`
            const response = await fetch(url)
            const responseData = await response.json()
            setUserCollectedCars(responseData.data)
            setFilteredCars(responseData.data)
        }
        if(!userCollectedCars){
            getUsercollectedCars()
        }
        setLoading(!loading)
    },[])

    useEffect(()=>{
        
        const filteredCars = userCollectedCars?.filter(car=>{
            for(const[key, values] of Object.entries(selectedFilters)){
                if(key==='query')continue
                const carKey= FILTER_KEYS[key]

                if(!values || values.length===0) continue;

                if(!values.includes(car[carKey])){
                    return false;
                }
            }

            const q= selectedFilters.query?.trim().toLowerCase();
            if(q){
                const words = selectedFilters.query.trim().toLowerCase().split(/\s+/)
                const matches = words.every(word=>
                    car.carMake.toLowerCase().includes(word) ||
                    car.carModel.toLowerCase().includes(word)
                )

                if(!matches) return false
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
                        filteredCars?.map(car=> <CarCard key={car._id} car={car} acBtnClick={()=>acBtnClick(car)}/>)
                    }
                </div>
            </div>
        </section>
    )
}