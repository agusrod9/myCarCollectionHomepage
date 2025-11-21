import styles from './DashBoard.module.css'
import {StatCard} from './StatCard'
import { ActionBtn } from './ActionBtn'
import { CarFront, Star, DollarSign, PlusCircle, Car } from "lucide-react"
import { toDo } from '../utils/toDo'
import { useNavigate } from 'react-router'
import { DashBoardCard } from './DashBoardCard'
import { useEffect, useState } from 'react'


export function DashBoard({handleAddCarBtnClick, userCarCount, userCarsValue, recentlyAddedCars}){
    
    
    const navigate = useNavigate()
    const [currencyIconForCard, setCurrencyIconForCard]  = useState("")
    const [amountForCard, setAmountForCard] = useState(0)
    const [tickerIndex, setTickerIndex] = useState(0);

    function handleCarDetailClick(car){
        navigate('details', {state:{car}})
    }
    function handleMyCollectionsBtnClick(){
        navigate('myCollections')
    }

    useEffect(() => {
        if (userCarsValue.length === 0) {
            setCurrencyIconForCard(<DollarSign size={40} />);
            setAmountForCard(0);
            return;
        }

        if (userCarsValue.length === 1) {
            setCurrencyIconForCard(`${userCarsValue[0].currencyCode} ${userCarsValue[0].currencyFlag}`);
            setAmountForCard(userCarsValue[0].totalAmount);
            return;
        }

        const interval = setInterval(() => {
            setTickerIndex(prev => (prev + 1) % userCarsValue.length);
        }, 1500);

        return () => clearInterval(interval);

    }, [userCarsValue]);

    useEffect(() => {
        if (userCarsValue.length <= 1) return;
        
        const current = userCarsValue[tickerIndex];
        setCurrencyIconForCard(`${current.currencyCode} ${current.currencyFlag}`);
        setAmountForCard(current.totalAmount);

    }, [tickerIndex, userCarsValue]);

    return(
        <section>
            <div className={styles.dashBoard}>
                <div className={styles.stats}>
                    <StatCard icon={<CarFront size={40}/>} label="My Garage" value={userCarCount} onClick={()=>navigate('/myGarage')} pointerCursor/>
                    <StatCard icon={<Star size={40}/>} label="???" value={3} onClick={()=>toDo("AUTOS FAVORITOS")}/>
                    <StatCard icon={currencyIconForCard} label="Total Value" value={amountForCard} onClick={()=>toDo("Etapa 2: Ver si se puede agregar pantalla con datos económicos, tablas, reportes por mes")}/>
                </div>
                <div className={styles.btns}>
                    <ActionBtn icon={<PlusCircle />} label="Add new car" extraClass={styles.specialBtn} onClick={handleAddCarBtnClick}/>
                    <ActionBtn icon={<Car />} label="My collections" onClick={handleMyCollectionsBtnClick}/>
                </div>
                <div className={styles.recentlyAddedCars}>
                    <div className={styles.recAddTitleContainer}>
                        <h3>Recently added</h3>
                    </div>
                    <span className={styles.recAddCardsContainer}>
                        {
                            recentlyAddedCars.length>0 ?
                            recentlyAddedCars.map(car=>(
                                <DashBoardCard car={car} containerClass = {styles.recentCardContainer} infoClass={styles.recentCardInfo} key={car._id} onClick={()=>handleCarDetailClick(car)} includeManuf={true}/>
                            ))
                            :
                            <div className={styles.noRecentCars}>
                                <p className={styles.noRecentCarsText}>Your garage is empty. Add your first car!</p>
                            </div>
                        }
                    </span>
                </div>
                <div className={styles.statsContainer}>
                    <div className={styles.statsTitleContainer}>
                        <h3>Garage Insights</h3>
                    </div>
                    <span className={styles.statCardsContainer}>
                        
                    </span>
                </div>
            </div>

        </section>
    )
}