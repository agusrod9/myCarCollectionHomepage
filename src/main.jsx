import { createRoot } from 'react-dom/client'
import './main.css'
import { BrowserRouter } from 'react-router'
import { Routes, Route, Navigate} from 'react-router'
import { HomeScreen } from './screens/HomeScreen.jsx'
import { AddCarScreen } from './screens/AddCarScreen.jsx'
import { LoginScreen } from './screens/LoginScreen.jsx'
import { RegisterScreen } from './screens/RegisterScreen.jsx'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen.jsx'
import { ProfileScreen } from './screens/ProfileScreen.jsx'
import { NotFoundScreen } from './screens/NotFoundScreen.jsx'
import { VerifyMailScreen } from './screens/VerifyMailScreen.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useState, useEffect } from 'react'
import Loading from './components/Loading.jsx'
import { ChangePassScreen } from './screens/ChangePassScreen.jsx'

function Main(){

    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserName, setLoggedUserName] = useState(null)
    const [loggedUserMustResetPass, setLoggedUserMustResetPass] = useState(false)
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        async function getLoggedUserId(){
        try {
            const isonline = await fetch('https://mycarcollectionapi.onrender.com/api/sessions/online', {method: 'POST', credentials:'include'})
            if(isonline.status==200){
                const userIdUrl = 'https://mycarcollectionapi.onrender.com/api/sessions/whoIsOnline'
                const opts = {method: 'POST', credentials: 'include'}
                const response = await fetch(userIdUrl, opts)
                const responseData = await response.json()
                setLoggedUserMustResetPass(responseData.mustResetPass)
                
                if(loggedUserMustResetPass){ 
                    //aca sweetalert con link
                }else{
                    setLoggedUserId(responseData.userId)
                    setLoggedUserName(responseData.userName)

                }
            }            
        }
        catch (error) {
            setLoggedUserId(null)
        } finally{
            setLoading(false)
        }
        }
        getLoggedUserId()
    },[])

    if(loading){
        return <Loading />
    }

    return <BrowserRouter>
                <Routes>
                    <Route path='/' element={<ProtectedRoute userId={loggedUserId} Component={HomeScreen} />} />
                    <Route path='/newCar' element={<ProtectedRoute userId={loggedUserId} Component={AddCarScreen} />} />
                    <Route path='/login' element={loggedUserId ? <Navigate to={'/'}/>: <LoginScreen />} />
                    <Route path='/register' element={loggedUserId ? <Navigate to={'/'}/> : <RegisterScreen />} />
                    <Route path='/verify' element={loggedUserId ? <Navigate to={'/'}/> : <VerifyMailScreen />} />
                    <Route path='/resetPass' element={<ResetPasswordScreen loggedUserId={loggedUserId}/>} />
                    <Route path='/changePass' element={<ChangePassScreen loggedUserId={loggedUserId}/>} />
                    <Route path='/profile' element={<ProtectedRoute userName= {loggedUserName} userId={loggedUserId} Component={ProfileScreen} />}/>
                    <Route path='*' element={<NotFoundScreen />}/>
                </Routes>
            </BrowserRouter>
}
createRoot(document.getElementById('root')).render(
    <Main />
)
