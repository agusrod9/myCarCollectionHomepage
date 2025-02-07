import './App.css'
import { useState, useEffect } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { HomeScreen } from './screens/HomeScreen.jsx'
import { AddCarScreen } from './screens/AddCarScreen.jsx'
import { LoginScreen } from './screens/LoginScreen.jsx'
import { RegisterScreen } from './screens/RegisterScreen.jsx'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen.jsx'
import { ProfileScreen } from './screens/ProfileScreen.jsx'
import { NotFoundScreen } from './screens/NotFoundScreen.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Loading from './components/Loading.jsx'


function App() {
  const [loggedUserId, setLoggedUserId] = useState(null)
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
          const loggedUserId = responseData.userId
          setLoggedUserId(loggedUserId)
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

  const router = createBrowserRouter([
    {
        path: '/',
        element : <ProtectedRoute user={loggedUserId} Component={HomeScreen} />,
        errorElement : <NotFoundScreen />
    },
    {
        path: '/login',
        element: !loggedUserId ? <LoginScreen /> : <Navigate to={'/'} />,
        errorElement : <NotFoundScreen />
    },
    {
        path: '/register',
        element: !loggedUserId ? <RegisterScreen /> : <Navigate to={'/'} />,
        errorElement : <NotFoundScreen />
    },
    {
        path: '/resetPass',
        element: <ProtectedRoute user={loggedUserId} Component={ResetPasswordScreen}/>,
        errorElement : <NotFoundScreen />
    },
    {
        path: '/profile',
        element: <ProtectedRoute user={loggedUserId} Component={ProfileScreen} />,
        errorElement : <NotFoundScreen />
    },
    {
        path: '/newCar',
        element: <ProtectedRoute user={loggedUserId} Component={AddCarScreen} />,
        errorElement : <NotFoundScreen />
    },
  ])

  if(loading){
    return <Loading />
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App
