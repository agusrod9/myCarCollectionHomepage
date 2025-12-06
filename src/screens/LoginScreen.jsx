import styles from './LoginScreen.module.css'
import { Login } from "../components/Login";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import usePageTitle from '../hooks/usePageTitle';
import BackHomeNav from '../components/BackHomeNav';


export function LoginScreen(){
    const {handleLogin} = useContext(AppContext)
    usePageTitle("Login")

    return(
        <section className={styles.LoginBody}>
            <Login onSuccess={handleLogin}/>
            <BackHomeNav />
        </section>
    )
}