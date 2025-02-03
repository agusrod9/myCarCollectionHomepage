import './App.css'
import { Login } from './components/Login.jsx'
import { useState, useEffect } from 'react'
import { AddCarScreen } from './screens/AddCarScreen.jsx'


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
    <>
    {
      loggedUserId!=undefined ? <AddCarScreen loggedUserId={loggedUserId}/> : <Login />
    }
      
    </>
  )
}

export default App
