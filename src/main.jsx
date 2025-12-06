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
import { useContext, useEffect } from 'react'
import { ChangePassScreen } from './screens/ChangePassScreen.jsx'
import './main.css'
import { MyGarageScreen } from './screens/MyGarageScreen.jsx'
import { CarDetailsScreen } from './screens/CarDetailsScreen.jsx'
import { MyCollectionsScreen } from './screens/MyCollectionsScreen.jsx'
import { Toaster } from 'react-hot-toast'
import useActivityPing from './hooks/useActivityPing.js'
import { TermsAndConditions } from './screens/TermsAndConditions.jsx'
import { LandingScreen } from './screens/LandingScreen.jsx'
import ContactScreen from './screens/ContactScreen.jsx'

function Main(){
    
    const host = window.location.host;
    const isLandingDomain =
        host === "thediecaster.com" ||
        host === "www.thediecaster.com" ||
        host === "dev.thediecaster.com:5173";

    const isAppDomain =
        host === "app.thediecaster.com" ||
        host === "app.dev.thediecaster.com:5173";
    const {loggedUserId} = useContext(AppContext)
    useActivityPing()

    if(isLandingDomain){
        return <>
            <BrowserRouter>
                <Routes> 
                    <Route path='/' element={<LandingScreen />} />
                    <Route path='/login' element={loggedUserId ? <Navigate to={'/'}/>: <LoginScreen/>} />
                    <Route path='/register' element={loggedUserId ? <Navigate to={'/'}/> : <RegisterScreen />} />
                    <Route path='/verify' element={loggedUserId ? <Navigate to={'/'}/> : <VerifyMailScreen />} />
                    <Route path='/resetPass' element={<ResetPasswordScreen loggedUserId={loggedUserId}/>} />
                    <Route path='/changePass' element={<ChangePassScreen loggedUserId={loggedUserId}/>} />
                    <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
                    <Route path='/contact' element={<ContactScreen />} />
                    <Route path='*' element={<NotFoundScreen />} />
                </Routes>
            </BrowserRouter>

            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: "#333",
                        color: "#fff",
                        textAlign: 'center'
                    },
                }}
            />
        </>
    }else if(isAppDomain){
        return <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<ProtectedRoute Component={HomeScreen} />} />
                    <Route path='/newCar' element={<ProtectedRoute Component={AddCarScreen} />} />
                    <Route path='/profile' element={<ProtectedRoute Component={ProfileScreen} />} />
                    <Route path='/myGarage' element={<ProtectedRoute Component={MyGarageScreen} />} />
                    <Route path='/myCollections' element={<ProtectedRoute Component={MyCollectionsScreen} />} />
                    <Route path='/details' element={<ProtectedRoute Component={CarDetailsScreen}/>} />
                    <Route path='/contact' element={<ProtectedRoute Component={ContactScreen} />} />
                    <Route path='*' element={<NotFoundScreen />} />
                </Routes>
            </BrowserRouter>

            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: "#333",
                        color: "#fff",
                        textAlign: 'center'
                    },
                }}
            />
        </>
    }else{
        return <>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<NotFoundScreen />} />
                </Routes>
            </BrowserRouter>
            
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: "#333",
                        color: "#fff",
                        textAlign: 'center'
                    },
                }}
            />
        </>
    }
}
createRoot(document.getElementById('root')).render(
    <AppContextProvider>
        <Main />
    </AppContextProvider>
)
