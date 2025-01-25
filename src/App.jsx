
import './App.css'
import { AddCarScreen } from './screens/AddCarScreen.jsx'


function App() {
  /*
  useEffect(()=>{
    fetch('https://mycarcollectionapi.onrender.com/api/cars')
    .then(response => response.json())
    .then(data => setCars(data.data))
  },[])
  */

  return (
    <>
      <AddCarScreen />
    </>
  )
}

export default App
