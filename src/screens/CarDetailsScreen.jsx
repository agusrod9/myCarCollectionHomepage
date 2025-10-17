import { useLocation } from 'react-router'
import styles from './CarDetailsScreen.module.css'
import { Header } from '../components/Header'
import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Edit, Save } from 'lucide-react'
import { ActionBtn } from '../components/ActionBtn'

export function CarDetailsScreen(){
    const location = useLocation()
    const {loggedUserId, loggedUserProfilePicture, loggedUserName, handleLogOut} = useContext(AppContext)
    const car = location.state?.car
    const [editingFields, setEditingFields] = useState({})
    const [editableCar, setEditableCar] = useState(Object.fromEntries(Object.entries(car).map(([Key,value])=>[Key, value?? ""])))
    const today = new Date()
    const anioActual = today.getFullYear()
    const anioMinimo = 1885
    const getClassByLength = (length) => {
        if (length < 70) return styles.green;
        if (length < 140) return styles.yellow;
        return styles.red;
    };
    console.log(editableCar)
    return(
        <span className={styles.screen}>
            <Header loggedUserId={loggedUserId} loggedUserProfilePicture={loggedUserProfilePicture} loggedUserName={loggedUserName} handleLogOut={handleLogOut}/>
            <div className={styles.container}>
                <div className={styles.imagesContainer}>
                    <p>Imágenes</p>
                </div>
                <div className={styles.infoContainer}>
                    <label htmlFor="carMake">Make</label>
                    <div className={styles.inputContainer}>
                        <input name='carMake' type="text" value={editableCar.carMake} className={styles.dataInput} disabled={!editingFields.carMake} onChange={(e)=>{setEditableCar(prev=>({...prev, carMake: e.target.value}))}}/>
                        {editingFields.carMake 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{carMake, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, carMake:true}))}/>
                        }
                    </div>
                    <label htmlFor="carModel">Model</label>
                    <div className={styles.inputContainer}>
                        <input name='carModel' type="text" value={editableCar.carModel} className={styles.dataInput} disabled={!editingFields.carModel} onChange={(e)=>{setEditableCar(prev=>({...prev, carModel: e.target.value }))}}/>
                        {editingFields.carModel 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{carModel, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, carModel:true}))}/>
                        }
                    </div>
                    <label htmlFor="carYear">Year</label>
                    <div className={styles.inputContainer}>
                        <input name='carYear' type="number" min={anioMinimo} max={anioActual+1} value={editableCar.carYear} className={styles.dataInput} disabled={!editingFields.carYear} onChange={(e)=>{setEditableCar(prev=>({...prev, carYear: e.target.value }))}}/>
                        {editingFields.carYear
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{carYear, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, carYear:true}))}/>
                        }
                    </div>
                    <label htmlFor="manufacturer">Manufacturer</label>
                    <div className={styles.inputContainer}>
                        <input name='manufacturer' type="text" value={editableCar.manufacturer} className={styles.dataInput} disabled={!editingFields.manufacturer} onChange={(e)=>{setEditableCar(prev=>({...prev, manufacturer: e.target.value }))}}/>
                        {editingFields.manufacturer 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{manufacturer, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, manufacturer:true}))}/>
                        }
                    </div>
                    <label htmlFor="scale">Scale</label>
                    <div className={styles.inputContainer}>
                        <input name='scale' type="text" value={editableCar.scale} className={styles.dataInput} disabled={!editingFields.scale} onChange={(e)=>{setEditableCar(prev=>({...prev, scale: e.target.value }))}}/>
                        {editingFields.scale 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{scale, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, scale:true}))}/>
                        }
                    </div>
                    <label htmlFor="series">Series</label>
                    <div className={styles.inputContainer}>
                        <input name='series' type="text" value={editableCar.series} className={styles.dataInput} disabled={!editingFields.series} onChange={(e)=>{setEditableCar(prev=>({...prev, series: e.target.value }))}}/>
                        {editingFields.series 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{series, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, series:true}))}/>
                        }
                    </div>
                    <label htmlFor="series_num">Series Number</label>
                    <div className={styles.inputContainer}>
                        <input name='series_num' type="text" value={editableCar.series_num} className={styles.dataInput} disabled={!editingFields.series_num} onChange={(e)=>{setEditableCar(prev=>({...prev, series_num: e.target.value }))}}/>
                        {editingFields.series_num 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{series_num, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, series_num:true}))}/>
                        }
                    </div>
                    <label htmlFor="price">Price</label>
                    <div className={styles.inputContainer}>
                        <input name='price' type="number" min={0} value={editableCar.price} className={styles.dataInput} disabled={!editingFields.price} onChange={(e)=>{setEditableCar(prev=>({...prev, price: e.target.value }))}}/>
                        {editingFields.price 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{price, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, price:true}))}/>
                        }
                    </div>
                    <label htmlFor="opened">Package</label>
                    <div className={styles.inputContainer}>
                        <input name='opened' type="text" value={editableCar.opened} className={styles.dataInput} disabled={!editingFields.opened} onChange={(e)=>{setEditableCar(prev=>({...prev, opened: e.target.value }))}}/>
                        {editingFields.opened 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{opened, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, opened:true}))}/>
                        }
                    </div>
                    <label htmlFor="collection">Collection</label>
                    <div className={styles.inputContainer}>
                        <input name='collection' type="text" value={editableCar.collectionId} className={styles.dataInput} disabled={!editingFields.collectionId} onChange={(e)=>{setEditableCar(prev=>({...prev, collectionId: e.target.value }))}}/>
                        {editingFields.collectionId 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{collectionId, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, collectionId:true}))}/>
                        }
                    </div>
                    <label htmlFor="notes">Notes</label>
                    <div className={`${styles.inputContainer} ${styles.notesContainer}`}>
                        <textarea name='notes' type="textarea" maxLength={140} value={editableCar.notes} className={`${styles.dataInput} ${styles.notesInput}`} disabled={!editingFields.notes} onChange={(e)=>{setEditableCar(prev=>({...prev, notes: e.target.value }))}}/>
                        {editingFields.notes 
                        ? 
                        <Save onClick={()=>setEditingFields(prev=>{
                            const{notes, ...rest}=prev
                            return rest
                            })}
                        /> 
                        : 
                        <Edit onClick={()=>setEditingFields(prev=>({...prev, notes:true}))}/>
                        }
                        {
                            editingFields.notes 
                            ?
                            <p className={`${styles.noteLengthIndicator} ${getClassByLength(editableCar.notes.length)}`}>{editableCar.notes.length}/140</p>
                            :
                            null
                        }
                    </div>
                    {Object.keys(editingFields).length>1 ? <ActionBtn label={"Save all"} icon={<Save/>}/> : null}
                    
                </div>
            </div>
        </span>
    )
}