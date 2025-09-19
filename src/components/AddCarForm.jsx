import { useEffect, useState } from 'react'
import './AddCarForm.css'
import Swal from 'sweetalert2';
import { ChevronDown, ChevronUp, CloudUpload, Save } from 'lucide-react';
import { ActionBtn } from './ActionBtn';

export function AddCarForm ({loggedUserId}){
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [year, setYear] = useState("")
    const [color, setColor] = useState("")
    const [scale, setScale] = useState("")
    const [manufacturer, setManufacturer] = useState("")
    const [notes, setNotes] = useState("")
    const [opened, setOpened] = useState("")
    const [series, setSeries] = useState("")
    const [seriesNum, setSeriesNum] = useState("")
    const [collection, setCollection] = useState("")
    const [userCollections, setUserCollections] = useState([])
    const [moreInfoDisplayed, setMoreInfoDisplayed] = useState(false)
    const [moreInfoBtnText, setMoreInfoBtnText] = useState("More...")
    const [images, setImages] = useState([])
    const [doneUploadingImages, setDoneUploadingImages] = useState(true)
    const [requiredFieldsSet, setRequiredFieldsSet] = useState(false)
    const today = new Date()
    const anioActual = today.getFullYear()
    const anioMinimo = 1885
    const scaleList = ['1/4', '1/5', '1/6', '1/8', '1/10', '1/12', '1/18', '1/24', '1/32', '1/36', '1/43', '1/48', '1/50', '1/55', '1/60', '1/61', '1/64', '1/70', '1/72', '1/76', '1/87', '1/100', '1/120', '1/148', '1/160', '1/200']

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
            setColor("")
            setScale("")
            setManufacturer("")
            setImages([])
            setNotes("")
            setOpened("")
            setSeries("")
            setSeriesNum("")
            setCollection("")
            setMoreInfoDisplayed(false)
            setDoneUploadingImages(true)
    }

    async function uploadImages(){
        const url = `https://mycarcollectionapi.onrender.com/api/aws?userId=${loggedUserId}`
        const opts = {
            method : 'POST'
        }
        const imagesUrls = await Promise.all( //hace que se espere a todos los fetch
            Array.from(images).map(async(img)=>{
                const formData = new FormData()
                formData.append('image', img)
                opts.body = formData
                const response = await fetch(url,opts)
                const data = await response.json()
                const imageUrl = data.url
                return imageUrl // Pushes the result to imagesUrls directly
            })
        )
        return imagesUrls;
    }

    async function newCarToApi(urls, make, model, color, year, scale, manufacturer, notes, opened, series, seriesNum){
        
        const url ='https://mycarcollectionapi.onrender.com/api/cars'
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
        const opts = {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        }
        
        const response = await fetch(url,opts)
        const responseData = await response.json()
        return responseData
    }

    const handleAddCarButtonClick = async(e)=>{
        e.preventDefault()
        const urls = await uploadImages()
        const added = await newCarToApi(urls, make, model, color, year, scale, manufacturer, notes, opened, series, seriesNum, collection)
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
        setImages(prev => [...prev, ...newImages])        
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
    }, [])
    
    useEffect(()=>{
        if(images.length>0){
            setTimeout(() => {
                setDoneUploadingImages(!doneUploadingImages)
            }, 2000);
        }
    },[images])

    return(
        <section className='addCarForm-section'>
            <div className='addCarForm-basicFields'>
                <div className='fieldContainer'> 
                    <label htmlFor='carMakeInput'>Make</label>
                    <input type="text" name='carMake' id='carMakeInput' value={make} onChange={(e)=>setMake(e.target.value)} placeholder='e: Ford' />
                </div>
                <div className='fieldContainer'>
                    <label htmlFor='carModelInput'>Model</label>
                    <input type="text" name='carModel' id='carModelInput' value={model} onChange={(e)=>setModel(e.target.value)} placeholder='e: Fiesta' />
                </div>
                <div className='fieldContainer'>
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
                <div className='fieldContainer'>
                    <ActionBtn id='AddCarFormMoreInfoButton' label={moreInfoBtnText} icon={moreInfoDisplayed ? <ChevronUp /> : <ChevronDown />} onClick={handleMoreInfoClick}>  </ActionBtn>
                </div>
                
            </div>
            <section className='dropArea'>
                <label id='dropaAreaWrapper' htmlFor="browseFileClick">
                    <CloudUpload size={300}/>
                    <p>Drag & drop your pictures here</p>
                    <p>OR</p>
                    <p><span id='browseFileClick'>Click to browse</span> from your device</p>
                    <input type="file" multiple id='filesUploadInput' accept='image/*' onChange={(e)=>handleNewImg(e)} />
                </label>
            </section>
            
            <section className={images.length>0 ? 'AddCarForm-imgSection' : 'AddCarForm-imgSection imgSectionHidden' }>
                <section className='AddCarForm-imgSection-preview'>
                    {
                    Array.from(images).map((img)=>{
                        return(
                                <img key={img.name} className='imgPreview' src={URL.createObjectURL(img)} />
                            )
                        })
                    }
                </section>
                <section className='AddCarForm-imgSection-message'>
                    <p hidden={doneUploadingImages}>Se están cargando las imágenes.</p>

                </section>
            </section>
            
            <section className={moreInfoDisplayed ? 'AddCarForm-moreDataSection': 'moreDataSectionHidden'}  >
                <div className='addCarForm-moreInfoFields'>
                    <div className='fieldContainer'>
                        <label htmlFor='carManufacturerInput'>Manufacturer</label>
                        <input type="text" name='carManufacturer' id='carManufacturerInput' value={manufacturer} onChange={(e)=>setManufacturer(e.target.value)} placeholder='e: Hotwheels'/>
                    </div>
                    <div className='fieldContainer'>
                        <label htmlFor='carSeriesInput'>Series</label>
                        <input type="text" name='carSeries' id='carSeriesInput' value={series} onChange={(e)=>setSeries(e.target.value)} placeholder='e: Hotwheels´s MUSCLE MANIA'  />
                    </div>
                    <div className='fieldContainer'>
                        <label htmlFor='carSeriesNumberInput'>Series Number</label>
                        <input type="text" name='carSeriesNumber' id='carSeriesNumberInput' value={seriesNum} onChange={(e)=>setSeriesNum(e.target.value)} placeholder='e: 44/100'/>
                    </div>
                    <div className='fieldContainer'>
                        <label htmlFor='carYearSelectInput'>Year</label>
                        <input type='number' min={anioMinimo} max={anioActual+1} name='carYear' id='carYearInput' value={year} onChange={(e)=>setYear(e.target.value)} placeholder='e: 2019'></input>
                    </div>
                    <div className='fieldContainer'>
                        <label htmlFor='carColorInput'>Color</label>
                        <input type="text" name='carColor' id='carColorInput' value={color} onChange={(e)=>setColor(e.target.value)} placeholder='e: Blanco' />
                    </div>
                    <div className='fieldContainer'>
                        <label htmlFor='carOpenedSelectInput'>Package</label>
                        <select name="carOpened" id="carOpenedSelectInput" value={opened} onChange={(e)=>setOpened(e.target.value)}  >
                            <option value={""}></option>
                            <option value='opened'>Opened</option>
                            <option value='sealed'>Closed</option>
                        </select>
                    </div>
                    <div className='fieldContainer'>
                        <label htmlFor='carNotesInput'>Notes</label>
                        <textarea type="text" name='carNotes' id='carNotesInput' value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder='e: Birthday gift' rows={4}/>
                    </div>
                    <div className='fieldContainer'>
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
                </div>
            </section>
            <div className='saveBtnContainer'>
                <ActionBtn id='addCarFormSaveButton' icon={<Save />} label={"Save"} onClick={handleAddCarButtonClick} disabled={!doneUploadingImages || !requiredFieldsSet } >
                </ActionBtn>
            </div>
        </section>
    )
}