import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import styles from './DashBoardCard.module.css'
import { getAddedDateText } from "../utils/dates.util"

export function DashBoardCard({car, containerClass, infoClass, includeManuf, onClick}){
    const {placeholder} = useContext(AppContext)
    const [addedDateInfo, setAddedDateInfo] = useState("")
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
            </div>
        </div>
    )
}