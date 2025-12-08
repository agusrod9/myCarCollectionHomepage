import { useCallback, useContext, useEffect, useState } from 'react'
import { Header } from '../components/Header'
import styles from  './CarListScreen.module.css'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import { SearchBar } from '../components/SearchBar'
import { CarCard } from '../components/CarCard'
import { FiltersPanel } from '../components/FiltersPanel'
import { useNavigate } from 'react-router'
import usePageTitle from '../hooks/usePageTitle'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function CarListScreen({mode}){
    const {
            loggedUserId, 
            loggedUserName, 
            loggedUserProfilePicture, 
            handleLogOut, 
            userCollectedCars, 
            setUserCollectedCars, 
            selectedFilters, 
            setSelectedFilters
        } = useContext(AppContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState("")
    const [filteredCars, setFilteredCars] = useState([])
    const FILTER_KEYS = {
        availableManufacturers : 'manufacturer',
        availableCarMakes : 'carMake',
        availableScales : 'scale',
    }
    usePageTitle(`${loggedUserName}´s Garage`)

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
        setLoading(true)
        async function loadCars(){
            if(mode==='myGarage'){
                setTitle("My Garage")
                const url = `${API_BASEURL}cars?userId=${loggedUserId}`
                const response = await fetch(url)
                const responseData = await response.json()
                setUserCollectedCars(responseData.data)
                setFilteredCars(responseData.data)
                setLoading(false)
            }
            if(mode==='myFavorites'){
                setTitle("My Favorites")
            }
        }
        if(loggedUserId){
            loadCars()
        }
        
    },[mode, loggedUserId])

    useEffect(()=>{
        
        const filteredCars = userCollectedCars?.filter(car=>{
            for(const[key, values] of Object.entries(selectedFilters)){
                if(key==='query') continue
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
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut(true)}}/>
            <div className={styles.myGarageContainer}>
                <div className={styles.myGFilters}>
                    <FiltersPanel setSelectedFilters={setSelectedFilters} selectedFilters={selectedFilters}/>
                </div>
                <div className={styles.myGSearchBar}>
                    <SearchBar  title={title} handleSearch={handleSearch}/>
                </div>
                <div className={styles.myGMain}>
                    {
                        filteredCars?.map(car=> <CarCard key={car._id} car={car} acBtnClick={()=>acBtnClick(car)}/>)
                    }
                </div>
            </div>
        </section>
    )
}