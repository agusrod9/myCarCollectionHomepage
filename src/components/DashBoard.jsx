import './DashBoard.css'
import { DashBoardItem } from './DashBoardItem'
import {StatCard} from './StatCard'
import { ActionBtn } from './ActionBtn'
import { CarFront, Star, DollarSign, PlusCircle, Car } from "lucide-react"
import { toDo } from '../utils/toDo'
import {CarCard} from './CarCard'


export function DashBoard({handleAddCarBtnClick}){
    return(
        <section>
            <div className='dashBoard'>
                <div className='stats'>
                    <StatCard icon={<CarFront size={40}/>} label="Cars" value={12} onClick={()=>toDo()}/>
                    <StatCard icon={<Star size={40}/>} label="Wishlist" value={3} onClick={()=>toDo()}/>
                    <StatCard icon={<DollarSign size={40}/>} label="Total Value" value={2450} onClick={()=>toDo()}/>
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
                        <CarCard car={{carMake: "Ford", carModel: "Fiesta", carColor:"White", imgUrl: "https://picsum.photos/200", manuf: "Bburago"}} containerClass = {"recentCardContainer"} infoClass={"recentCardInfo"}/>
                        <CarCard car={{carMake: "Ford", carModel: "Escort", carColor:"White", imgUrl: "https://picsum.photos/201"}} containerClass = {"recentCardContainer"} infoClass={"recentCardInfo"} />
                        <CarCard car={{carMake: "Ford", carModel: "Fiesta", carColor:"White", imgUrl: "https://picsum.photos/202"}} containerClass = {"recentCardContainer"} infoClass={"recentCardInfo"}/>
                    </span>
                </div>
                <div className='wlCars'>
                    <div id='wlTitleContainer'>
                        <h3>My Wishlist</h3>
                    </div>
                    <span id='wlCardsContainer'>
                        <CarCard car={{carMake: "Ford", carModel: "Fiesta", carColor:"White", imgUrl: "https://picsum.photos/203", manuf: "Bburago"}} containerClass = {"wlCardContainer"} infoClass={"wlCardInfo"} includeManuf/>
                        <CarCard car={{carMake: "Ford", carModel: "Escort", carColor:"White", imgUrl: "https://picsum.photos/204", manuf: "Maisto"}} containerClass = {"wlCardContainer"} infoClass={"wlCardInfo"} includeManuf/>
                        <CarCard car={{carMake: "Ford", carModel: "Fiesta", carColor:"White", imgUrl: "https://picsum.photos/205", manuf: "HotWheels"}} containerClass = {"wlCardContainer"} infoClass={"wlCardInfo"} includeManuf/>
                    </span>
                </div>
            </div>

        </section>
    )
}