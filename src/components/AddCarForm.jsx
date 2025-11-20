import { useContext, useEffect, useState } from 'react'
import styles from'./AddCarForm.module.css'
import Swal from 'sweetalert2';
import { ChevronDown, ChevronUp, CloudUpload, Save } from 'lucide-react';
import { ActionBtn } from './ActionBtn';
import { AppContext } from '../context/AppContext';
import { CirclePicker } from 'react-color';
import { uploadManyImages } from '../utils/images.utils';

const API_BASEURL = import.meta.env.VITE_API_BASEURL;
export function AddCarForm (){
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [year, setYear] = useState("")
    const [color, setColor] = useState("#fff")
    const [scale, setScale] = useState("")
    const [manufacturer, setManufacturer] = useState("")
    const [notes, setNotes] = useState("")
    const [opened, setOpened] = useState("")
    const [series, setSeries] = useState("")
    const [seriesNum, setSeriesNum] = useState("")
    const [collection, setCollection] = useState("")
    const [currency, setCurrency] = useState("")
    const [price, setPrice] = useState({currency, amount: 0})
    const [moreInfoDisplayed, setMoreInfoDisplayed] = useState(false)
    const [colorSelectDisplayed, setColorSelectDisplayed] = useState(false)
    const [moreInfoBtnText, setMoreInfoBtnText] = useState("More...")
    const [images, setImages] = useState([])
    const [doneUploadingImages, setDoneUploadingImages] = useState(true)
    const [requiredFieldsSet, setRequiredFieldsSet] = useState(false)
    const today = new Date()
    const anioActual = today.getFullYear()
    const anioMinimo = 1885

    const{setUserCarCount, setUserCarsValue, scaleList, loggedUserRole, userCollections, setUserCollections, currenciesList, setCurrenciesList, loggedUserId, setUserCollectedCars, userCollectedCars, updateRecentlyAddedCars } = useContext(AppContext);
    
    if(make != "" && model !="" && scale!=""){
        if(!requiredFieldsSet){
            setRequiredFieldsSet(true)
        }
    }else if(requiredFieldsSet){
        setRequiredFieldsSet(false)
    }
    const resetStates = ()=>{
        setMake("")
            setModel("")
            setYear("")
            setColor("#fff")
            setScale("")
            setManufacturer("")
            setImages([])
            setNotes("")
            setOpened("")
            setSeries("")
            setSeriesNum("")
            setCollection("")
            setPrice({currency, amount: 0})
            setMoreInfoDisplayed(false)
            setDoneUploadingImages(true)
    }

    async function newCarToApi(urls, make, model, color, year, scale, manufacturer, notes, opened, series, seriesNum, collection, price){
        const url =`${API_BASEURL}/api/cars`
        
        const data = {
            carMake : make,
            carModel : model,
            scale,
            userId : loggedUserId
        }
        if(manufacturer!=""){data.manufacturer = manufacturer}
        if(year!=""){data.carYear = year}
        if(color!=""){data.carColor = color}
        if(notes!=""){data.notes = notes}
        if(opened!=""){data.opened = opened}
        if(series!=""){data.series = series}
        if(seriesNum!=""){data.series_num = seriesNum}
        if(collection!=""){data.collectionId = collection}
        if(urls.length>0){data.img_urls = urls}
        if(price.amount!=0 && price.currency!=""){
            data.price = price
        }else{
            setCurrency("")
            data.price= null;
        }

        const opts = {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        }
        
        const response = await fetch(url,opts)
        const responseData = await response.json()
        return responseData
    }

    const handleCurrencyChange = (e)=>{
        setCurrency(e.target.value)
        setPrice(prev => ({...(prev || {}), currency : e.target.value}))
    }

    const handleAddCarButtonClick = async(e)=>{
        e.preventDefault()
        const start = Date.now();
        const urls = await uploadManyImages(loggedUserId,"carImages", images)
        const end = Date.now();
        const elapsedSeconds = ((end - start) / 1000).toFixed(2);
        console.log(`Demoró ${elapsedSeconds} segundos en subir ${images.length} imágenes.`)
        const added = await newCarToApi(urls, make, model, color, year, scale, manufacturer, notes, opened, series, seriesNum, collection, price)
        if(added.error){
            alert(added.error)
        }else{
            Swal.fire({
                position: "center",
                icon: "success",
                titleText: `New: ${make} ${model}.`,
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                toast: true,
                width : '300px'
            });
            setUserCollectedCars(prev=>[...prev, added.data])
            setUserCarCount(prev => prev +1)
            if(added.data.price){
                setUserCarsValue(prev => {
                    const currencyExists = prev.find(entry=> entry.currencyId === added.data.price.currency);

                    if(currencyExists){
                        return prev.map(entry=>{
                            if(entry.currencyId=== added.data.price.currency){
                                return{...entry, totalAmount : entry.totalAmount + added.data.price.amount};
                            }
                            return entry;
                        })
                    }

                    return [
                        ...prev,
                        {
                            totalAmount: added.data.price.amount,
                            currencyId: added.data.price.currency,
                            currencyCode: added.data.currencyInfo.code,
                            currencyName: added.data.currencyInfo.name,
                            currencySymbol: added.data.currencyInfo.symbol,
                            currencyFlag: added.data.currencyInfo.flag,
                            currencyCountry: added.data.currencyInfo.country
                        }


                    ]
                })
            }
            
            updateRecentlyAddedCars()
            resetStates()
        }
    }

    const handleMoreInfoClick = ()=>{
        setMoreInfoDisplayed(!moreInfoDisplayed)
        if(moreInfoBtnText=="More..."){
            setMoreInfoBtnText("Less...")
        }else{
            setMoreInfoBtnText("More...")
        }
    }

    const handleNewImg = async(e)=>{
        setDoneUploadingImages(!doneUploadingImages)
        const newImages = Array.from(e.target.files)
        const role = loggedUserRole
        const maxImagesAllowed =    role === "PRO" ? 10 :
                                    role === "PREMIUM" ? 5 :
                                    role === "BASIC" ? 2
                                    : 1
        if(images.length + newImages.length > maxImagesAllowed){
            alert(`Your ${loggedUserRole} account allows you to upload ${maxImagesAllowed} images per car.`)
            return
        } 
        setImages(prev => [...prev, ...newImages])        
    }

    useEffect(()=>{
        if(!loggedUserId) return
        const collectionsUrl= `${API_BASEURL}/api/carcollections?userId=${loggedUserId}`
        async function getUserCollections(){
            const response = await fetch(collectionsUrl)
            const responseData = await response.json()
            if(response.status==200){
                setUserCollections(responseData.data)
            }
        }

        async function getCurrencies(){
            const response = await fetch(`${API_BASEURL}/api/currencies`);
            const responseData = await response.json();
            if(response.status==200){
                setCurrenciesList(responseData.data);
            }
        }

        async function getUsercollectedCars(){
            const url = `${API_BASEURL}/api/cars?userId=${loggedUserId}`
            const response = await fetch(url)
            const responseData = await response.json()
            
            setUserCollectedCars(responseData.data)
        }

        if(userCollections?.length===0){
            getUserCollections()
        }
        if(currenciesList?.length===0){
            getCurrencies()
        }
        if(userCollectedCars?.length===0){
            getUsercollectedCars()
        }
        
    }, [])
    
    useEffect(()=>{
        if(images.length>0){
            setTimeout(() => {
                setDoneUploadingImages(!doneUploadingImages)
            }, 2000);
        }
    },[images])

    return(
        <section className={styles.addCarFormSection}>
            <div className={styles.addCarFormBasicFields}>
                <div className={styles.fieldContainer}> 
                    <label htmlFor='carMakeInput'>Make</label>
                    <input type="text" name='carMake' id='carMakeInput' value={make} onChange={(e)=>setMake(e.target.value)} placeholder='e: Ford' />
                </div>
                <div className={styles.fieldContainer}>
                    <label htmlFor='carModelInput'>Model</label>
                    <input type="text" name='carModel' id='carModelInput' value={model} onChange={(e)=>setModel(e.target.value)} placeholder='e: Fiesta' />
                </div>
                <div className={styles.fieldContainer}>
                    <label htmlFor='carScaleSelectInput'>Scale</label>
                    <select name="carScale" id="carScaleSelectInput" value={scale} onChange={(e)=>setScale(e.target.value)} >
                        <option value={""}></option>
                        {
                            scaleList.map((scaleItem)=>{
                                return(
                                    <option key={scaleItem} value={scaleItem}>{scaleItem}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className={styles.fieldContainer}>
                    <ActionBtn className={styles.AddCarFormMoreInfoButton} label={moreInfoBtnText} icon={moreInfoDisplayed ? <ChevronUp /> : <ChevronDown />} onClick={handleMoreInfoClick}>  </ActionBtn>
                </div>
                
            </div>
            <section className={styles.dropArea}>
                <label className={styles.dropaAreaWrapper} htmlFor="browseFileClick">
                    <CloudUpload size={300}/>
                    <p>Drag & drop your pictures here</p>
                    <p>OR</p>
                    <p><span>Click to browse</span> from your device</p>
                    <input 
                        type="file" 
                        id="browseFileClick"
                        multiple={["BASIC", "PREMIUM", "PRO"].includes(loggedUserRole)}
                        className={styles.filesUploadInput} 
                        accept='image/*' 
                        onChange={(e)=>handleNewImg(e)} 
                    />
                </label>
            </section>
            
            <section className={images.length>0 ? `${styles.AddCarFormImgSection}` : `${styles.AddCarFormImgSection} ${styles.imgSectionHidden}`} >
                <section className={styles.AddCarFormImgSectionPreview}>
                    {
                    Array.from(images).map((img)=>{
                        return(
                                <img key={img.name} className={styles.imgPreview} src={URL.createObjectURL(img)} />
                            )
                        })
                    }
                </section>
                <section className={styles.AddCarFormImgSectionMessage}>
                    <p hidden={doneUploadingImages}>Se están cargando las imágenes.</p>

                </section>
            </section>
            
            <section className={moreInfoDisplayed ? `${styles.AddCarFormMoreDataSection}` : `${styles.moreDataSectionHidden}`}  >
                <div className={styles.addCarFormMoreInfoFields}>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carCollectionSelectInput'>Collection</label>
                        <select name="carCollection" id="carCollectionSelectInput" value={collection} onChange={(e)=>setCollection(e.target.value)}>
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
                    </div>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carManufacturerInput'>Manufacturer</label>
                        <input type="text" name='carManufacturer' id='carManufacturerInput' value={manufacturer} onChange={(e)=>setManufacturer(e.target.value)} placeholder='e: Hotwheels'/>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carSeriesInput'>Series</label>
                        <input type="text" name='carSeries' id='carSeriesInput' value={series} onChange={(e)=>setSeries(e.target.value)} placeholder='e: Hotwheels´s MUSCLE MANIA'  />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carSeriesNumberInput'>Series Number</label>
                        <input type="text" name='carSeriesNumber' id='carSeriesNumberInput' value={seriesNum} onChange={(e)=>setSeriesNum(e.target.value)} placeholder='e: 44/100'/>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carYearSelectInput'>Year</label>
                        <input type='number' min={anioMinimo} max={anioActual+1} name='carYear' id='carYearInput' value={year} onChange={(e)=>setYear(e.target.value)} placeholder='e: 2019'></input>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carColorInput'>Main Color</label>
                        <div className={styles.carColorInput} style={{backgroundColor:color}} onClick={()=>setColorSelectDisplayed(!colorSelectDisplayed)} ></div>
                        {colorSelectDisplayed ?
                            <CirclePicker className={styles.colorPicker} onChangeComplete={(color)=>{
                                setColor(color.hex)
                                setColorSelectDisplayed(!colorSelectDisplayed)
                            }}/>
                            :
                            null
                        }
                        
                    </div>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carOpenedSelectInput'>Package</label>
                        <select name="carOpened" id="carOpenedSelectInput" value={opened} onChange={(e)=>setOpened(e.target.value)} >
                            <option value={""}></option>
                            <option value='opened'>Opened</option>
                            <option value='sealed'>Closed</option>
                            <option value='damaged'>Damaged</option>
                        </select>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carPriceInput'>Price</label>
                        <div className={styles.currencyFieldContainer}>
                            <select name="currency" className={styles.currencySelectInput} value={currency} onChange={handleCurrencyChange} > 
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
                            <input type="number" name='carPrice' id='carPriceInput' value={price?.amount} min={0} onChange={(e)=>setPrice(prev => ({...(prev || {}), amount : Number(e.target.value)}))} placeholder='e: 4.99'/>
                        </div>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='carNotesInput'>Notes</label>
                        <textarea type="text" name='carNotes' className={styles.carNotesInput} value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder='e: Birthday gift' rows={4}/>
                    </div>
                    <div className={styles.fieldContainer}>
                            
                    </div>
                    
                </div>
            </section>
            <div className={styles.saveBtnContainer}>
                <ActionBtn className={styles.addCarFormSaveButton} icon={<Save />} label={"Save"} onClick={handleAddCarButtonClick} disabled={!doneUploadingImages || !requiredFieldsSet } >
                </ActionBtn>
            </div>
        </section>
    )
}