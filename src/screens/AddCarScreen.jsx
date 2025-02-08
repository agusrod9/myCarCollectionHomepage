import './AddCarScreen.css'
import { AddCarForm } from "../components/AddCarForm";
import { Header } from '../components/Header';

export function AddCarScreen({loggedUserId}){
    return(
        <section className="AddCarBody">
            <Header loggedUserId={loggedUserId} />
            <div className='formContainer'>
                <AddCarForm loggedUserId={loggedUserId}/>
            </div>
        </section>
    )
}