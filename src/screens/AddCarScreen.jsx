import './AddCarScreen.css'
import { AddCarForm } from "../components/AddCarForm";
import { Header } from '../components/Header';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function AddCarScreen(){
    const {handleLogOut, loggedUserId, loggedUserName, loggedUserProfilePicture} = useContext(AppContext)
    return(
        <section className="AddCarBody">
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut(true)}}/>
            <h1>New Car</h1>
            <div className='AddCar-formContainer'>
                <AddCarForm />
            </div>
        </section>
    )
}