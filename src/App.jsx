import './App.css'
import { useState, useEffect } from 'react'
import { AddCarScreen } from './screens/AddCarScreen.jsx'
import { LoginScreen } from './screens/LoginScreen.jsx'
import { LandingScreen } from './screens/LandingScreen.jsx'
import { HomeScreen } from './screens/HomeScreen.jsx'
import { RegisterScreen } from './screens/RegisterScreen.jsx'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'


function App() {

  const [loggedUserId, setLoggedUserId] = useState(null)

  useEffect(()=>{
    async function getLoggedUserId(){
        const isonline = await fetch('https://mycarcollectionapi.onrender.com/api/sessions/online', {method: 'POST', credentials:'include'})
        
        if(isonline.status==200){
            const userIdUrl = 'https://mycarcollectionapi.onrender.com/api/sessions/whoIsOnline'
            const opts = {method: 'POST', credentials: 'include'}
            const response = await fetch(userIdUrl, opts)
            const responseData = await response.json()
            const loggedUserId = responseData.userId
            setLoggedUserId(loggedUserId)
        }            
    }
    if(loggedUserId==null){
        getLoggedUserId()
    }
    
},[])
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={loggedUserId ? <HomeScreen /> : <LandingScreen />} />
        <Route path='/newCar' element={loggedUserId ? <AddCarScreen loggedUserId={loggedUserId}/> : <LandingScreen />} />
        <Route path='/login' element={loggedUserId ? null: <LoginScreen />} />
        <Route path='/register' element={loggedUserId ? null : <RegisterScreen />} />
        <Route path='/resetPass' element={<ResetPasswordScreen/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
