import { useLocation } from 'react-router'
import styles from './CarDetailsScreen.module.css'
import { Header } from '../components/Header'
import { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { Ban, ChevronLeftCircle, ChevronRightCircle, Edit, Save, Trash2Icon } from 'lucide-react'
import { ActionBtn } from '../components/ActionBtn'
import Swal from 'sweetalert2'
import { toDo } from '../utils/toDo'

export function CarDetailsScreen(){
    const location = useLocation()
    const {loggedUserId, loggedUserProfilePicture, loggedUserName, handleLogOut, scaleList} = useContext(AppContext)
    const [car, setCar] = useState(location.state?.car)
    const [editingFields, setEditingFields] = useState({})
    const [editableCar, setEditableCar] = useState(Object.fromEntries(Object.entries(car).map(([Key,value])=>[Key, value?? ""])))
    const [userCollections, setUserCollections] = useState([])
    const [changesMade, setChangesMade] = useState(false)
    const today = new Date()
    const anioActual = today.getFullYear()
    const anioMinimo = 1885
    const carImgCount = editableCar.img_urls.length
    const [viewingImageIndex, setViewingImageIndex] = useState(0)
    const imgContainerRef = useRef(null);
    const getClassByLength = (length) => {
        if (length < 70) return styles.green;
        if (length < 140) return styles.yellow;
        return styles.red;
    };
    const nextImageIndex = ()=>{
        if(viewingImageIndex+1<carImgCount){
            setViewingImageIndex(viewingImageIndex+1)
        }
    }
    const prevImageIndex = ()=>{
        if(viewingImageIndex>0){
            setViewingImageIndex(viewingImageIndex-1)
        }
    }

    const handleCarDelete = async()=>{
        Swal.fire({
            title: "Are you sure you want to delete this car?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Delete",
            denyButtonText: `Cancel`
        }).then(async(result) => {
            if (result.isConfirmed) {
                const url = `https://mycarcollectionapi.onrender.com/api/cars/${car._id}`
                const opts = {
                    method : "DELETE",
            }
            const response = await fetch(url,opts)
            if(response.status == 200){
                Swal.fire("Deleted!", "", "success");
                toDo("Quitar auto del caché y navegar una pantalla para atrás.")
            }else{
                Swal.fire("Please try again!", "", "error");
            }
        }
        });
    }

    async function saveCar(){
        const url = `https://mycarcollectionapi.onrender.com/api/cars/${editableCar._id}`
        const opts = {
            method: "PUT",
            headers : {'Content-Type' : 'application/json'},
            body: JSON.stringify(editableCar)
        }
        const response = await fetch(url,opts)
        if(response.status==200){
            setCar(editableCar)
            alert("Modificado con éxito")
        }
    }

    const handleSaveAll = async()=>{
        await saveCar()
        setEditingFields({})
        console.log({car:car, editableCar:editableCar})
        setCar(editableCar)
        setChangesMade(false)
    }

    const handleSave = async(field)=>{
        await saveCar()
        setEditingFields(prev=>{
            const{[field] : _, ...rest}=prev
            return rest
        })
    }

    useEffect(()=>{
            if(!loggedUserId) return
            const collectionsUrl= `https://mycarcollectionapi.onrender.com/api/carcollections?userId=${loggedUserId}`
            async function getUserCollections(){
                const usrCollections = await fetch(collectionsUrl)
                const usrCollectionsData = await usrCollections.json()
                if(usrCollections.status==200){
                    setUserCollections(usrCollectionsData.data)
                }
            }
            getUserCollections()
        }, [loggedUserId])

    useEffect(()=>{
        if(!car || !editableCar) return
        setChangesMade(Object.keys(editableCar).some((key)=>{
            return editableCar[key] !== car[key]
        }))
    },[editableCar])

    useEffect(()=>{
        if (imgContainerRef.current) {
            setTimeout(() => imgContainerRef.current.focus(), 100);
        }
    },[])

    return(
        <span className={styles.screen}>
            <Header loggedUserId={loggedUserId} loggedUserProfilePicture={loggedUserProfilePicture} loggedUserName={loggedUserName} handleLogOut={handleLogOut}/>
            <div className={styles.container}>
                <div className={styles.imagesSection} tabIndex={0} ref={imgContainerRef} onKeyDown={
                    (e)=>{
                        if(e.key === 'ArrowLeft') prevImageIndex()
                        if(e.key === 'ArrowRight') nextImageIndex()
                    }
                }>
                    <div className={styles.imageContainer}>
                        <img src={car.img_urls[viewingImageIndex]} alt="" className={styles.imgDisplayed} />
                    </div>
                    {carImgCount>1 && viewingImageIndex>0 ?
                    <div className={styles.navLeft}>
                        <ChevronLeftCircle size={36} onClick={prevImageIndex}/> 
                    </div>
                    : null}
                    {carImgCount>1 && viewingImageIndex<carImgCount-1 ?
                    <div className={styles.navRight}>
                        <ChevronRightCircle size={36} onClick={nextImageIndex}/>
                    </div>
                    : null}
                    {carImgCount>1?
                    <p className={styles.imageCountIndicator}>{`${viewingImageIndex+1}/${carImgCount}`}</p>
                    :null}
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.infoTitleContainer}>
                        <p className={styles.infoTitle}>{`${car.carMake} ${car.carModel}`}</p>
                        <Trash2Icon onClick={handleCarDelete} size={30}/>
                    </div>
                    <fieldset className={styles.inputGroup}>
                        <legend className={styles.inputGroupName}>Vehicle</legend>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="carMake">Make</label>
                            <div className={editingFields.carMake ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input name='carMake' type="text" value={editableCar.carMake} className={editingFields.carMake ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.carMake} onChange={(e)=>{setEditableCar(prev=>({...prev, carMake: e.target.value}))}}/>
                                {editingFields.carMake 
                                ? 
                                <Save size={30} onClick={()=>handleSave("carMake")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, carMake:true}))}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="carModel">Model</label>
                            <div className={editingFields.carModel ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input name='carModel' type="text" value={editableCar.carModel} className={editingFields.carModel ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.carModel} onChange={(e)=>{setEditableCar(prev=>({...prev, carModel: e.target.value }))}}/>
                                {editingFields.carModel 
                                ? 
                                <Save size={30} onClick={()=>handleSave("carModel")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, carModel:true}))}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="carYear">Year</label>
                            <div className={editingFields.carYear ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input name='carYear' type="number" min={anioMinimo} max={anioActual+1} value={editableCar.carYear} className={editingFields.carYear ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.carYear} onChange={(e)=>{setEditableCar(prev=>({...prev, carYear: e.target.value }))}}/>
                                {editingFields.carYear
                                ? 
                                <Save size={30} onClick={()=>handleSave("carYear")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, carYear:true}))}/>
                                }
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className={styles.inputGroup}>
                        <legend className={styles.inputGroupName}>Model</legend>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="scale">Scale</label>
                            <div className={editingFields.scale ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <select name="scale" value={editableCar.scale} className={editingFields.scale ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.scale} onChange={(e)=>{setEditableCar(prev=>({...prev, scale: e.target.value }))}} >
                                <option value={""}></option>
                                    {
                                        scaleList.map((scaleItem)=>{
                                            return(
                                                <option key={scaleItem} value={scaleItem}>{scaleItem}</option>
                                            )
                                        })
                                    }
                                </select>
                                {editingFields.scale 
                                ? 
                                <Save size={30} onClick={()=>handleSave("scale")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, scale:true}))}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="manufacturer">Manufacturer</label>
                            <div className={editingFields.manufacturer ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input name='manufacturer' type="text" value={editableCar.manufacturer} className={editingFields.manufacturer ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.manufacturer} onChange={(e)=>{setEditableCar(prev=>({...prev, manufacturer: e.target.value }))}}/>
                                {editingFields.manufacturer 
                                ? 
                                <Save size={30} onClick={()=>handleSave("manufacturer")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, manufacturer:true}))}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="series">Series</label>
                            <div className={editingFields.series ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input name='series' type="text" value={editableCar.series} className={editingFields.series ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.series} onChange={(e)=>{setEditableCar(prev=>({...prev, series: e.target.value }))}}/>
                                {editingFields.series 
                                ? 
                                <Save size={30} onClick={()=>handleSave("series")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, series:true}))}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="series_num">Series Number</label>
                            <div className={editingFields.series_num ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input name='series_num' type="text" value={editableCar.series_num} className={editingFields.series_num ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.series_num} onChange={(e)=>{setEditableCar(prev=>({...prev, series_num: e.target.value }))}}/>
                                {editingFields.series_num 
                                ? 
                                <Save size={30} onClick={()=>handleSave("series_num")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, series_num:true}))}/>
                                }
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className={styles.inputGroup}>
                        <legend className={styles.inputGroupName}>Pack</legend>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="collection">Collection</label>
                            <div className={editingFields.collectionId ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <select name="collection" value={editableCar.collectionId} className={editingFields.collectionId ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.collectionId} onChange={(e)=>{setEditableCar(prev=>({...prev, collectionId: e.target.value }))}}>
                                    <option value={""}></option>
                                    {
                                        userCollections.length>0 ?
                                        userCollections.map((col)=>{
                                            return(
                                                <option key={col._id} value={col._id}>{col.collectionName}</option>
                                            )
                                        })
                                        :
                                        null
                                    }
                                    
                                </select>
                                {editingFields.collectionId 
                                ? 
                                <Save size={30} onClick={()=>handleSave("collectionId")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, collectionId:true}))}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="price">Price</label>
                            <div className={editingFields.price ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input name='price' type="number" min={0} value={editableCar.price} className={editingFields.price ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.price} onChange={(e)=>{setEditableCar(prev=>({...prev, price: e.target.value }))}}/>
                                {editingFields.price 
                                ? 
                                <Save size={30} onClick={()=>handleSave("price")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, price:true}))}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="opened">Package</label>
                            <div className={editingFields.opened ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <select name="opened" value={editableCar.opened} className={editingFields.opened ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} disabled={!editingFields.opened} onChange={(e)=>{setEditableCar(prev=>({...prev, opened: e.target.value }))}}>
                                    <option value={""}></option>
                                    <option value='opened'>Opened</option>
                                    <option value='sealed'>Closed</option>
                                </select>
                                {editingFields.opened 
                                ? 
                                <Save size={30} onClick={()=>handleSave("opened")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, opened:true}))}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="notes">Notes</label>
                            <div className={editingFields.notes ? `${styles.inputContainer} ${styles.notesContainer} ${styles.editingMode}`: `${styles.inputContainer} ${styles.notesContainer}`}>
                                <textarea name='notes' type="textarea" maxLength={140} value={editableCar.notes} className={editingFields.notes ? `${styles.dataInput} ${styles.notesInput} ${styles.editingMode}` : `${styles.dataInput} ${styles.notesInput}`} disabled={!editingFields.notes} onChange={(e)=>{setEditableCar(prev=>({...prev, notes: e.target.value }))}}/>
                                {editingFields.notes 
                                ? 
                                <Save size={30} onClick={()=>handleSave("notes")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, notes:true}))}/>
                                }
                            </div>
                            {
                            editingFields.notes 
                            ?
                            <p className={`${styles.noteLengthIndicator} ${getClassByLength(editableCar.notes.length)}`}>{editableCar.notes.length}/140</p>
                            :
                            <p className={`${styles.noteLengthIndicator} ${styles.transparentIndicator}`}>_</p>
                            }
                        </div>
                        
                    </fieldset>
                    <div className={styles.lowerBtnContainer}>
                        {Object.keys(editingFields).length>0 ? <ActionBtn label={"Cancel"} icon={<Ban/>}  onClick={()=>{
                            setEditingFields({})
                            setChangesMade(false)
                        }} /> : null}
                        {Object.keys(editingFields).length>1 ? <ActionBtn label={"Save all"} icon={<Save/>}  onClick={handleSaveAll} disabled={!changesMade}/> : null}
                    </div>
                </div>
            </div>
        </span>
    )
}