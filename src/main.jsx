import { AppContext, AppContextProvider } from './context/AppContext.jsx'
import { createRoot } from 'react-dom/client'
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
import { useContext } from 'react'
import { ChangePassScreen } from './screens/ChangePassScreen.jsx'
import './main.css'

function Main(){

    const {loggedUserId, loggedUserName} = useContext(AppContext)
    

    return <BrowserRouter>
                <Routes>
                    <Route path='/' element={<ProtectedRoute userName={loggedUserName} userId={loggedUserId} Component={HomeScreen} />} />
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
    <AppContextProvider>
        <Main />
    </AppContextProvider>
)
