import './AddCarScreen.css'
import { AddCarForm } from "../components/AddCarForm";
import { Header } from '../components/Header';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';

export function AddCarScreen(){
    const {handleLogOut, loggedUserId, loggedUserName, loggedUserProfilePicture} = useContext(AppContext)
    usePageTitle("New car")
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