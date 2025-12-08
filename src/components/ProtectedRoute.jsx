import { AppContext } from '../context/AppContext';
import { useContext, useEffect } from 'react';

const VITE_FRONT_URL = import.meta.env.VITE_FRONT_URL;

export default function ProtectedRoute({children}) {
    const{loggedUserId} = useContext(AppContext)

    useEffect(()=>{
        if (!loggedUserId) {
            window.location.href = `${VITE_FRONT_URL}/login`;
        }
    },[loggedUserId])

    return children;
}