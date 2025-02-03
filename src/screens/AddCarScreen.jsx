import './AddCarScreen.css'
import { AddCarForm } from "../components/AddCarForm";

export function AddCarScreen({loggedUserId}){
    return(
        <section className="AddCarBody">
            <AddCarForm loggedUserId={loggedUserId}/>
        </section>
    )
}