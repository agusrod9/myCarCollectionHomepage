import { CircleEllipsis } from 'lucide-react'
import { ActionBtn } from './ActionBtn'
import styles from './CarCard.module.css'

export function CarCard({car, acBtnClick}){
    return(
        <div className={styles.cardContainer} key={car._id}>
            <img src={car.img_urls[0]} alt={`imágen de un ${car.carMake}`} className={styles.cardImg}/>
            <div className={styles.cardInfoContainer}>
                <p className={styles.cardCarMake}>{car.carMake} {car.carModel}</p>
                <p className={styles.cardCarScale}>{car.scale}</p>
            </div>
            <ActionBtn label={'Details'} icon={<CircleEllipsis/>} extraClass={styles.carCardBtn} onClick={()=>acBtnClick(car._id)}/>
        </div>
    )
}