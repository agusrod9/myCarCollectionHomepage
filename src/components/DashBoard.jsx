import './DashBoard.css'
import {StatCard} from './StatCard'
import { ActionBtn } from './ActionBtn'
import { CarFront, Star, DollarSign, PlusCircle, Car } from "lucide-react"
import { toDo } from '../utils/toDo'
import { useNavigate } from 'react-router'
import { DashBoardCard } from './DashBoardCard'


export function DashBoard({handleAddCarBtnClick, userCarCount, userCarsValue, recentlyAddedCars}){
    const navigate = useNavigate()
    function handleCarDetailClick(car){
        navigate('details', {state:{car}})
    }
    return(
        <section>
            <div className='dashBoard'>
                <div className='stats'>
                    <StatCard icon={<CarFront size={40}/>} label="My Garage" value={userCarCount} onClick={()=>navigate('/myGarage')}/>
                    <StatCard icon={<Star size={40}/>} label="Wishlist" value={3} onClick={()=>toDo("Ver que modulo agregar acá, Wishlist no voy a tener en MVP")}/>
                    <StatCard icon={<DollarSign size={40}/>} label="Total Value" value={userCarsValue} onClick={()=>toDo("Etapa 2: Ver si se puede agregar pantalla con datos económicos, tablas, reportes por mes")}/>
                </div>
                <div className='btns'>
                    <ActionBtn icon={<PlusCircle />} label="Add new car" extraClass="specialBtn" onClick={handleAddCarBtnClick}/>
                    <ActionBtn icon={<Car />} label="My collections" onClick={()=>toDo()}/>
                </div>
                <div className='recentlyAddedCars'>
                    <div id='recAddTitleContainer'>
                        <h3>Recently added</h3>
                    </div>
                    <span id='recAddCardsContainer'>
                        {
                            recentlyAddedCars.length>0 ?
                            recentlyAddedCars.map(car=>(
                                <DashBoardCard car={car} containerClass = {"recentCardContainer"} infoClass={"recentCardInfo"} key={car._id} onClick={()=>handleCarDetailClick(car)}/>
                            ))
                            :
                            <div className='noRecentCars'>
                                <p id='noRecentCarsText'>Your garage is empty. Add your first car!</p>
                            </div>
                        }
                    </span>
                </div>
                <div className='wlCars'>
                    <div id='wlTitleContainer'>
                        <h3>My Wishlist</h3>
                    </div>
                    <span id='wlCardsContainer'>
                        
                    </span>
                </div>
            </div>

        </section>
    )
}