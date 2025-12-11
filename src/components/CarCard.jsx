import { CircleEllipsis, Star } from 'lucide-react'
import { ActionBtn } from './ActionBtn'
import styles from './CarCard.module.css'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { capitalize } from '../utils/textUtils'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;
export function CarCard({car, acBtnClick, onFavoriteToggle}){

    const {placeholder, setUserFavoritesCount, userFavoritesCount, setUserCollectedCars} = useContext(AppContext)
    const infoLine1 = `${car.carMake} ${car.carModel}`
    const infoLine2Parts = [
        car.manufacturer,
        car.scale,
        car.carYear
    ].filter(Boolean)
    const infoLine3Parts = [
        capitalize(car.packaging),
        capitalize(car.condition),
        `Owned: ${car.quantityOwned}`
    ].filter(Boolean)
    const infoLine4Parts = [
        car.isCustomized ? "Custom" : null
    ].filter(Boolean)

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
                if(onFavoriteToggle){
                    onFavoriteToggle(car._id, !car.isFavorite)
                }
                return updated
            })
        }else{
            toast.error(`Error adding ${car.carMake} ${car.carModel} to favorites`, {duration:2000, id : t});
        }
    }
    return(
        <div className={styles.cardContainer}>
            <img src={car.img_urls[0] || placeholder} alt={`Picture of ${car.carMake} car.`} className={styles.cardImg}/>
            <Star size={30} color='#1458bd' fill={car.isFavorite ? '#3a7aec' : 'none'} className={styles.favoriteIcon} onClick={()=>handleAddToFavToggle(car)}/>
            <div className={styles.cardInfoContainer}>
                <p className={styles.cardLine1}>{infoLine1}</p>
                <div className={styles.infoPills}>
                    {infoLine2Parts.map((part, i) => (
                        <span key={i} className={styles.pill}>{part}</span>
                    ))}
                </div>
                <div className={styles.infoPills}>
                    {infoLine3Parts.map((part, i) => (
                        <span key={i} className={styles.pill}>{part}</span>
                    ))}
                </div>
                <div className={styles.infoPills}>
                    {infoLine4Parts.map((part, i) => (
                        <span key={i} className={styles.pill}>{part}</span>
                    ))}
                </div>
            </div>
            <ActionBtn label={'Details'} icon={<CircleEllipsis/>} extraClass={styles.carCardBtn} onClick={()=>acBtnClick(car._id)}/>
        </div>
    )
}