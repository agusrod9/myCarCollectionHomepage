import styles from './AddCarScreen.module.css'
import { AddCarForm } from "../components/AddCarForm";
import { Header } from '../components/Header';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';

export function AddCarScreen(){
    const {handleLogOut, loggedUserId, loggedUserName, loggedUserProfilePicture} = useContext(AppContext)
    usePageTitle("New car")
    return(
        <section className={styles.root}>
            <Header loggedUserId={loggedUserId} loggedUserName={loggedUserName} loggedUserProfilePicture= {loggedUserProfilePicture} handleLogOut={()=>{handleLogOut(true)}}/>
            <section className={styles.AddCarBody}>
                <h1>New Car</h1>
                <AddCarForm />
            </section>
        </section>
    )
}