import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import styles from './DashBoardCard.module.css'
import { getAddedDateText } from "../utils/dates.util"
import { Star } from "lucide-react"
import toast from "react-hot-toast"

export function DashBoardCard({car, containerClass, infoClass, includeManuf, onClick}){
    const API_BASEURL = import.meta.env.VITE_API_BASEURL;
    const {placeholder, setUserFavoritesCount, userFavoritesCount, setUserCollectedCars} = useContext(AppContext)
    const [addedDateInfo, setAddedDateInfo] = useState("")
    const handleAddToFavToggle = async(car)=>{
        let t;
        let action = "";
        if(car.isFavorite){
            t = toast.loading("Removing from favorites...", {duration : 10000});
            action = "remove"
        }else{
            action = "add"
            t = toast.loading("Adding to favorites...", {duration : 10000});
        }
        const updateData = {
            isFavorite : !car.isFavorite
        }
        const url = `${API_BASEURL}cars/${car._id}`
        const opts = {
            method : 'PUT',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(updateData)
        }
        const response = await fetch(url,opts);
        if(response.status === 200){
            action === "add" ? setUserFavoritesCount(userFavoritesCount+1) : setUserFavoritesCount(userFavoritesCount-1)
            action === "add" ? 
                toast.success(`${car.carMake} ${car.carModel} added to favorites!`, {duration:2000, id : t})
                :
                toast.success(`${car.carMake} ${car.carModel} removed from favorites!`, {duration:2000, id : t})
            setUserCollectedCars(prev=> {
                const updated = prev.map(c=> 
                    c._id === car._id 
                    ? {...c, isFavorite : !car.isFavorite}
                    : c
                )
                
                return updated
            })
        }else{
            toast.error(`Error adding ${car.carMake} ${car.carModel} to favorites`, {duration:2000, id : t});
        }
    }

    useEffect(()=>{
        setAddedDateInfo(getAddedDateText(car.dateAdded))
    },[])
    return(
        <div className={containerClass} onClick={onClick}>
            {car.img_urls.length<1 ? <img src={placeholder} /> : <img src={car.img_urls[0] || ""}/>}
            <div className={infoClass}>
                <p className={styles.row}>{car.carMake} {car.carModel}</p>
                {includeManuf ? <p className={styles.row}>{car.manufacturer}</p> : <p></p>}
                <p className={styles.row}>{car.scale}</p>
                <p className={`${styles.row} ${styles.lastRow}`}>{addedDateInfo}</p>
                <Star size={22} color='#1458bd' fill={car.isFavorite ? '#3a7aec' : 'none'} className={styles.favoriteIcon} onClick={(e)=>{
                        e.stopPropagation()
                        handleAddToFavToggle(car)
                    }
                }/>
            </div>
        </div>
    )
}