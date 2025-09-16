import './AddCarScreen.css'
import { AddCarForm } from "../components/AddCarForm";
import { Header } from '../components/Header';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function AddCarScreen({loggedUserId, loggedUserName, loggedUserProfilePicture}){
    const {handleLogOut} = useContext(AppContext)
    return(
        <section className="AddCarBody">
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={handleLogOut}/>
            <h1>Add New Car</h1>
            <div className='AddCar-formContainer'>
                <AddCarForm loggedUserId={loggedUserId}/>
            </div>
        </section>
    )
}