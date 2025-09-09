import './DashBoard.css'
import { DashBoardItem } from './DashBoardItem'
import {StatCard} from './StatCard'
import { ActionBtn } from './ActionBtn'
import { CarFront, Star, DollarSign, PlusCircle, Car } from "lucide-react"
import { toDo } from '../utils/toDo'
import {CarCard} from './CarCard'


export function DashBoard(){
    return(
        <section>
            <div className='dashBoard'>
                <div className='stats'>
                    <StatCard icon={<CarFront size={40}/>} label="Cars" value={12} onClick={()=>toDo()}/>
                    <StatCard icon={<Star size={40}/>} label="Wishlist" value={3} onClick={()=>toDo()}/>
                    <StatCard icon={<DollarSign size={40}/>} label="Total Value" value={2450} onClick={()=>toDo()}/>
                </div>
                <div className='btns'>
                    <ActionBtn icon={<PlusCircle />} label="Add new car" extraClass="specialBtn" onClick={()=>toDo()}/>
                    <ActionBtn icon={<Car />} label="My collections" onClick={()=>toDo()}/>
                </div>
                <div className='recentlyAddedCars'>
                    <div id='recAddTitleContainer'>
                        <h3>Recently added</h3>
                    </div>
                    <span id='recAddCardsContainer'>
                        <CarCard car={{carMake: "Ford", carModel: "Fiesta", carColor:"White", imgUrl: "https://picsum.photos/200"}} />
                        <CarCard car={{carMake: "Ford", carModel: "Escort", carColor:"White", imgUrl: "https://picsum.photos/201"}} />
                        <CarCard car={{carMake: "Ford", carModel: "Fiesta", carColor:"White", imgUrl: "https://picsum.photos/202"}} />
                    </span>
                </div>
            </div>

        </section>
    )
}