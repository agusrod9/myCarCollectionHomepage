
import { useEffect, useState } from 'react'
import './App.css'
import { AddCarForm } from './components/AddCarForm.jsx'

function App() {
  const [cars, setCars] = useState([])
  /*
  useEffect(()=>{
    fetch('https://mycarcollectionapi.onrender.com/api/cars')
    .then(response => response.json())
    .then(data => setCars(data.data))
  },[])
  */

  return (
    <>
      <AddCarForm />
    </>
  )
}

export default App
