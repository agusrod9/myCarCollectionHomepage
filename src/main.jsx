import './main.css'
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
import { CarListScreen } from './screens/CarListScreen.jsx'
import { CarDetailsScreen } from './screens/CarDetailsScreen.jsx'
import { MyCollectionsScreen } from './screens/MyCollectionsScreen.jsx'
import { Toaster } from 'react-hot-toast'
import useActivityPing from './hooks/useActivityPing.js'
import { TermsAndConditions } from './screens/TermsAndConditions.jsx'
import { LandingScreen } from './screens/LandingScreen.jsx'
import ContactScreen from './screens/ContactScreen.jsx'
import RedirectToApp from './components/RedirectToApp.jsx'
import CollectorScreen from './screens/CollectorScreen.jsx'
import { ProfileScreen2 } from './screens/ProfileScreen2.jsx'

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
                    <Route path='/' element={loggedUserId ? <RedirectToApp /> : <LandingScreen />} />
                    <Route path='/login' element={loggedUserId ? <Navigate to={'/'}/> : <LoginScreen/>} />
                    <Route path='/register' element={loggedUserId ? <Navigate to={'/'}/> : <RegisterScreen />} />
                    <Route path='/verify' element={loggedUserId ? <Navigate to={'/'}/> : <VerifyMailScreen />} />
                    <Route path='/resetPass' element={<ResetPasswordScreen loggedUserId={loggedUserId}/>} />
                    <Route path='/changePass' element={<ChangePassScreen loggedUserId={loggedUserId}/>} />
                    <Route path='/collector/:collectorUserName' element={<CollectorScreen />} />
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
                    <Route path='/' element={<ProtectedRoute> <HomeScreen /> </ProtectedRoute>} />
                    <Route path='/newCar' element={<ProtectedRoute> <AddCarScreen /> </ProtectedRoute>} />
                    <Route path='/profile' element={<ProtectedRoute> <ProfileScreen2 /> </ProtectedRoute>} />
                    <Route path='/myGarage' element={<ProtectedRoute> <CarListScreen mode = 'myGarage' /> </ProtectedRoute>} />
                    <Route path='/myFavorites' element={<ProtectedRoute> <CarListScreen mode = 'myFavorites' /> </ProtectedRoute>} />
                    <Route path='/myCollections' element={<ProtectedRoute> <MyCollectionsScreen /> </ProtectedRoute>} />
                    <Route path='/details' element={<ProtectedRoute> <CarDetailsScreen /> </ProtectedRoute>} />
                    <Route path='/contact' element={<ProtectedRoute> <ContactScreen /> </ProtectedRoute>} />
                    <Route path='/collector/:collectorUserName' element={<CollectorScreen />} />
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
