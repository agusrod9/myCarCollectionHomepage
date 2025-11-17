import { useLocation } from 'react-router'
import styles from './CarDetailsScreen.module.css'
import { Header } from '../components/Header'
import { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { Ban, ChevronLeftCircle, ChevronRightCircle, Edit, Save, Trash2Icon } from 'lucide-react'
import { ActionBtn } from '../components/ActionBtn'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router'
import { toDo } from '../utils/toDo'

const API_BASEURL = import.meta.env.VITE_API_BASEURL;
export function CarDetailsScreen(){
    const navigate = useNavigate()
    const location = useLocation()
    const {loggedUserId, loggedUserProfilePicture, loggedUserName, handleLogOut, scaleList, userCollections, setUserCollections, userCollectedCars, setUserCollectedCars, setUserCarCount, setUserCarsValue, updateRecentlyAddedCars, currenciesList, setCurrenciesList} = useContext(AppContext)
    const [car, setCar] = useState(location.state?.car)
    const [editingFields, setEditingFields] = useState({})
    const [editableCar, setEditableCar] = useState(Object.fromEntries(Object.entries(car).map(([key,value])=>{
                                                                                                                if(key === "price"){
                                                                                                                    if(value!=null){
                                                                                                                        return [key, value]
                                                                                                                    }
                                                                                                                    return [key, {currency: "", amount: 0}];
                                                                                                                }
                                                                                                                return [key, value?? ""]
                                                                                                            })))
    const [changesMade, setChangesMade] = useState(false)
    const [viewingImageIndex, setViewingImageIndex] = useState(0)
    const today = new Date()
    const anioActual = today.getFullYear()
    const anioMinimo = 1885
    const carImgCount = editableCar.img_urls.length
    const imgContainerRef = useRef(null);
    const getClassByLength = (length) => {
        if (length < 70) return styles.green;
        if (length < 140) return styles.yellow;
        return styles.red;
    };
    console.log({carprice: editableCar.price})
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

    const handleCurrencyChange = (e)=>{
        setEditableCar(prev => ({...prev, price : {...prev.price, currency : e.target.value}}))
    }

    const updateCarInContext=(updatedCar)=>{
        setUserCollectedCars(prev=> prev.map(car=> car._id === updatedCar._id ? updatedCar : car))
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
                const url = `${API_BASEURL}/api/cars/${car._id}`
                const opts = {
                    method : "DELETE",
                }
                const response = await fetch(url,opts)
                if(response.status == 200){
                    const deleteEveryImagePromise = car.img_urls.map((imgUrl)=>{
                        const awsKey = imgUrl.split('.amazonaws.com/')[1]
                        const url = `${API_BASEURL}/api/aws/?id=${awsKey}`
                        const opts = {
                            method : "DELETE",
                        }
                        return fetch(url,opts)
                    })
                    await Promise.all(deleteEveryImagePromise)
                    Swal.fire("Deleted!", "", "success");
                    setUserCollectedCars(prev => prev?.filter(c => c._id !== car._id) ?? []);
                    setUserCarCount(prev => prev -1)
                    setUserCarsValue(prev => {
                        return prev.map(entry=>{
                            if(entry.currencyId === car.price.currency){
                                return{...entry, totalAmount: entry.totalAmount - car.price.amount};
                            }
                            return entry;
                        }).filter(entry=>entry.totalAmount>0)
                    })
                    updateRecentlyAddedCars()
                    navigate(-1)
                }else{
                    Swal.fire("Please try again!", "", "error");
                }
            }
        });
    }

    async function saveCar(key){
        const url = `${API_BASEURL}/api/cars/${editableCar._id}`
        let newValue;
        let isDifferent = false;
        let priceEditedFlag = false
        if(key==="price"){
            const newAmount = Number(editableCar.price?.amount) || 0;
            const newCurrency = editableCar.price?.currency ?? editableCar.price?.currencyId ?? null;
            const oldAmount = Number(car.price?.amount) || 0;
            const oldCurrency = car.price?.currency ?? car.price?.currencyId ?? null;
            newValue = { amount : newAmount, currency : newCurrency };

            if (newAmount !== oldAmount || newCurrency !== oldCurrency) {
                isDifferent = true;
            }
            if(newAmount === 0 || newCurrency===""){
                toDo("You need to type a valid price to be set.");
                setEditableCar(prev=>({...prev, price:{currency:"", amount:0}}))
                return;
            }else{
                priceEditedFlag=true
            }
        }else{
            newValue = editableCar[key] === "" ? null : editableCar[key];
            const oldValue = car[key];

            if (newValue !== oldValue) {
                isDifferent = true;
            }
        }
        if (!isDifferent) {
            toDo("No changes to save");
            return;
        }
        const opts = {
            method: "PUT",
            headers : {'Content-Type' : 'application/json'},
            body: JSON.stringify({[key]:newValue})
        }
        const response = await fetch(url,opts);
        if(response.status==200){
            setCar(prev => ({
                ...prev,
                [key]: newValue
            }));
            const responseData = await response.json();
            const updatedCarFromBD = responseData.data;
            updateCarInContext(updatedCarFromBD)
            if(priceEditedFlag){
                const response = await fetch(`${API_BASEURL}/api/users/${loggedUserId}/carsValue`);
                const responseData = await response.json();
                setUserCarsValue(responseData.data)
            }
        }
    }

    async function saveAllCar(){
        const updatedFields = {}
        let priceEditedFlag = false
        Object.keys(editingFields).forEach(key=>{
            if(key==="price"){
                const newAmount = Number(editableCar.price?.amount) || 0;
                const newCurrency = editableCar.price?.currency ?? editableCar.price?.currencyId ?? null;
                const carPrice = car?.price ?? {};
                const carAmount = Number(carPrice.amount) || 0;
                const carCurrency = carPrice.currency ?? carPrice.currencyId ?? null;

                if(newAmount === 0 || newCurrency ===""){
                    setEditableCar(prev=>({...prev, price:{currency:"", amount:0}}))
                    return;
                }
                if (newAmount !== carAmount || newCurrency !== carCurrency) {
                    updatedFields.price = { amount: newAmount, currency: newCurrency };
                    priceEditedFlag = true;
                }
            }else {
                const newVal = editableCar[key] === "" ? null : editableCar[key];
                const oldVal = car[key];

                if (newVal !== oldVal) {
                    updatedFields[key] = newVal;
                }
            }
        })

        if(Object.keys(updatedFields).length===0){
            return
        }

        const url = `${API_BASEURL}/api/cars/${editableCar._id}`
        const opts = {
            method: "PUT",
            headers : {'Content-Type' : 'application/json'},
            body: JSON.stringify(updatedFields)
        }
        const response = await fetch(url,opts)
        if(response.status==200){
            const updatedCar = {...car}
            Object.keys(updatedFields).forEach((key) => {
                updatedCar[key] = updatedFields[key];
            });
            setCar(updatedCar)
            const responseData = await response.json();
            updateCarInContext(responseData.data)
            if(priceEditedFlag){
                const response = await fetch(`${API_BASEURL}/api/users/${loggedUserId}/carsValue`);
                const responseData = await response.json();
                setUserCarsValue(responseData.data)
            }
        }
    }

    const handleSaveAll = async()=>{
        await saveAllCar()
        setEditingFields({})
        setChangesMade(false)
    }

    const handleSave = async(field)=>{
        await saveCar(field)
        setEditingFields(prev=>{
            const{[field] : _, ...rest}=prev
            return rest
        })
        setChangesMade(false)
    }

    const handleKeyDownSaveOrCancel = async(e,field)=>{
        if(e.key==="Enter"){
            e.preventDefault()
            handleSave(field)
        }

        if(e.key==="Esc" || e.key==="Escape"){
            e.preventDefault()
            setEditingFields({})
            setChangesMade(false)
        }
    }

    useEffect(()=>{
        if(!car || !editableCar) return
        setChangesMade(Object.keys(editableCar).some((key)=>{
            if(editableCar[key]=="" && car[key]==null){
                return false
            }
            if(editableCar[key] !== car[key]){
                return true
            }
            return false
        }))
    },[editableCar])

    useEffect(()=>{
        if (imgContainerRef.current) {
            setTimeout(() => imgContainerRef.current.focus(), 100);
        }
        if(!loggedUserId) return

        async function getCurrencies(){
            const response = await fetch(`${API_BASEURL}/api/currencies`);
            const responseData = await response.json();
            if(response.status==200){
                setCurrenciesList(responseData.data);
            }
        }

        const collectionsUrl= `${API_BASEURL}/api/carcollections?userId=${loggedUserId}`
        async function getUserCollections(){
            const response = await fetch(collectionsUrl)
            const responseData = await response.json()
            if(response.status==200){
                setUserCollections(responseData.data)
            }
        }

        async function getUsercollectedCars(){
            const url = `${API_BASEURL}/api/cars?userId=${loggedUserId}`
            const response = await fetch(url)
            const responseData = await response.json()
            setUserCollectedCars(responseData.data)
        }

        if(currenciesList?.length===0){
            getCurrencies()
        }

        if(userCollections.length==0){
            getUserCollections()
        }

        if(userCollectedCars?.length==0){
            getUsercollectedCars()
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
                        <Trash2Icon onClick={handleCarDelete} size={30} className={styles.deleteIcon}/>
                    </div>
                    <fieldset className={styles.inputGroup}>
                        <legend className={styles.inputGroupName}>Vehicle</legend>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="carMake">Make</label>
                            <div className={editingFields.carMake ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input 
                                    name='carMake' 
                                    type="text" 
                                    value={editableCar.carMake} 
                                    className={editingFields.carMake ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.carMake} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, carMake: e.target.value}))}
                                    }
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"carMake")}
                                />
                                {editingFields.carMake 
                                ? 
                                <Save size={30} onClick={()=>handleSave("carMake")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, carMake:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="carModel">Model</label>
                            <div className={editingFields.carModel ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input 
                                    name='carModel' 
                                    type="text" 
                                    value={editableCar.carModel} 
                                    className={editingFields.carModel ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.carModel} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, carModel: e.target.value }))}
                                    }
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"carModel")}
                                />
                                {editingFields.carModel 
                                ? 
                                <Save size={30} onClick={()=>handleSave("carModel")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, carModel:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="carYear">Year</label>
                            <div className={editingFields.carYear ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input 
                                    name='carYear' 
                                    type="number" 
                                    min={anioMinimo} 
                                    max={anioActual+1} 
                                    value={editableCar.carYear} 
                                    className={editingFields.carYear ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.carYear} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, carYear: e.target.value }))}
                                    } 
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"carYear")}
                                />
                                {editingFields.carYear
                                ? 
                                <Save size={30} onClick={()=>handleSave("carYear")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, carYear:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className={styles.inputGroup}>
                        <legend className={styles.inputGroupName}>Model</legend>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="scale">Scale</label>
                            <div className={editingFields.scale ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <select 
                                    name="scale" 
                                    value={editableCar.scale} 
                                    className={editingFields.scale ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.scale} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, scale: e.target.value }))}
                                    } 
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"scale")}
                                >
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
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, scale:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="manufacturer">Manufacturer</label>
                            <div className={editingFields.manufacturer ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input 
                                    name='manufacturer' 
                                    type="text" 
                                    value={editableCar.manufacturer} 
                                    className={editingFields.manufacturer ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.manufacturer} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, manufacturer: e.target.value }))}
                                    } 
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"manufacturer")}
                                />
                                {editingFields.manufacturer 
                                ? 
                                <Save size={30} onClick={()=>handleSave("manufacturer")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, manufacturer:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="series">Series</label>
                            <div className={editingFields.series ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input 
                                    name='series' 
                                    type="text" 
                                    value={editableCar.series} 
                                    className={editingFields.series ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.series} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, series: e.target.value }))}
                                    } 
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"series")}
                                />
                                {editingFields.series 
                                ? 
                                <Save size={30} onClick={()=>handleSave("series")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, series:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="series_num">Series Number</label>
                            <div className={editingFields.series_num ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <input 
                                    name='series_num' 
                                    type="text" 
                                    value={editableCar.series_num} 
                                    className={editingFields.series_num ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.series_num} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, series_num: e.target.value }))}
                                    } 
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"series_num")}
                                />
                                {editingFields.series_num 
                                ? 
                                <Save size={30} onClick={()=>handleSave("series_num")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, series_num:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className={styles.inputGroup}>
                        <legend className={styles.inputGroupName}>Pack</legend>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="collection">Collection</label>
                            <div className={editingFields.collectionId ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <select 
                                    name="collection" 
                                    value={editableCar.collectionId} 
                                    className={editingFields.collectionId ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.collectionId} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, collectionId: e.target.value }))}
                                    } 
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"collectionId")}
                                >
                                    <option value={null}></option>
                                    {
                                        userCollections?.length>0 ?
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
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, collectionId:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="price">Price</label>
                            <div className={editingFields.price ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <select name="currency" className={styles.currencySelectInput} value={editableCar.price.currency} onChange={handleCurrencyChange} disabled={!editingFields.price}> 
                                    <option key={"noCurrency"} value={""}>Select</option>
                                    {
                                        currenciesList?.length>0 ?
                                        currenciesList.map((currencyItem)=>{
                                            return(
                                                <option key={currencyItem._id} value={currencyItem._id}>{currencyItem.code} {currencyItem.flag}</option>
                                            )
                                        })
                                        :
                                        null
                                    }
                                </select>
                                <input 
                                    name='price' 
                                    type="number" 
                                    min={0} 
                                    value={editableCar.price.amount} 
                                    className={editingFields.price ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.price} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({
                                            ...prev,
                                            price: {
                                                ...prev.price,
                                                amount: Number(e.target.value)
                                            }
                                        }))
                                    }}
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"price")}
                                />
                                {editingFields.price 
                                ? 
                                <Save size={30} onClick={()=>handleSave("price")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, price:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="opened">Package</label>
                            <div className={editingFields.opened ? `${styles.inputContainer} ${styles.editingMode}`: styles.inputContainer}>
                                <select 
                                    name="opened" 
                                    value={editableCar.opened} 
                                    className={editingFields.opened ? `${styles.dataInput} ${styles.editingMode}` : styles.dataInput} 
                                    disabled={!editingFields.opened} 
                                    onChange={(e)=>{
                                        setEditableCar(prev=>({...prev, opened: e.target.value }))}
                                    } 
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"opened")}
                                >
                                    <option value={""}></option>
                                    <option value='opened'>Opened</option>
                                    <option value='sealed'>Closed</option>
                                </select>
                                {editingFields.opened 
                                ? 
                                <Save size={30} onClick={()=>handleSave("opened")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, opened:true}))} className={styles.editIcon}/>
                                }
                            </div>
                        </div>
                        <div className={styles.inputSubGroup}>
                            <label htmlFor="notes">Notes</label>
                            <div className={editingFields.notes ? `${styles.inputContainer} ${styles.notesContainer} ${styles.editingMode}`: `${styles.inputContainer} ${styles.notesContainer}`}>
                                <textarea 
                                    name='notes' 
                                    type="textarea" 
                                    maxLength={140} 
                                    value={editableCar.notes} 
                                    className={editingFields.notes ? `${styles.dataInput} ${styles.notesInput} ${styles.editingMode}` : `${styles.dataInput} ${styles.notesInput}`} 
                                    disabled={!editingFields.notes} 
                                    onChange={(e)=>{setEditableCar(prev=>({...prev, notes: e.target.value }))}} 
                                    onKeyDown={(e)=>handleKeyDownSaveOrCancel(e,"notes")}
                                />
                                {editingFields.notes 
                                ? 
                                <Save size={30} onClick={()=>handleSave("notes")} className={changesMade ? styles.saveBtnActive : styles.saveBtnDisabled}
                                /> 
                                : 
                                <Edit size={30} onClick={()=>setEditingFields(prev=>({...prev, notes:true}))} className={styles.editIcon}/>
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