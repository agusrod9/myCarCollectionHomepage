import { CircleEllipsis, Star } from 'lucide-react'
import { ActionBtn } from './ActionBtn'
import styles from './CarCard.module.css'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;
export function CarCard({car, acBtnClick}){

    const {placeholder, setUserFavoritesCount, userFavoritesCount, setUserCollectedCars} = useContext(AppContext)
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
            toast.success(`${car.carMake} ${car.carModel} added to favorites!`, {duration:2000, id : t});
            setUserCollectedCars(prev=> 
                prev.map(c=> 
                    c._id === car._id
                    ?
                    {...c, isFavorite : !car.isFavorite}
                    :
                    c
                )
            )
        }else{
            toast.error(`Error adding ${car.carMake} ${car.carModel} to favorites`, {duration:2000, id : t});
        }
    }
    return(
        <div className={styles.cardContainer} key={car._id}>
            <img src={car.img_urls[0] || placeholder} alt={`imágen de un ${car.carMake}`} className={styles.cardImg}/>
            <Star fill={car.isFavorite ? '#fff' : 'none'} className={styles.favoriteIcon} onClick={()=>handleAddToFavToggle(car)}/>
            <div className={styles.cardInfoContainer}>
                <p className={styles.cardCarMake}>{car.carMake} {car.carModel}</p>
                <p className={styles.cardCarScale}>{car.scale}</p>
            </div>
            <ActionBtn label={'Details'} icon={<CircleEllipsis/>} extraClass={styles.carCardBtn} onClick={()=>acBtnClick(car._id)}/>
        </div>
    )
}