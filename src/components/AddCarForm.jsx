import { useEffect, useState } from 'react'
import './AddCarForm.css'
import imageCompression from 'browser-image-compression';
import Swal from 'sweetalert2';

export function AddCarForm (){
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
    const [moreInfoVisibility, setMoreInfoVisibility] = useState("none")
    const [images, setImages] = useState([])
    const [compressedImages, setCompressedImages] = useState([])
    const [doneUploadingImages, setDoneUploadingImages] = useState(true)
    const [requiredFieldsSet, setRequiredFieldsSet] = useState(false)
    const [loggedUserId, setLoggedUserId] = useState("6764ae99520ac472521c906c")

    const moreDataSectionStlyles = {display : moreInfoVisibility}
    const yearsToSelect =[]
    const today = new Date()
    for(let i=today.getFullYear(); i>= 1885 ; i--){
        yearsToSelect.push(i)
    }
    const scaleList = ['1/4', '1/5', '1/6', '1/8', '1/10', '1/12', '1/18', '1/24', '1/32', '1/36', '1/43', '1/48', '1/50', '1/55', '1/60', '1/64', '1/70', '1/72', '1/76', '1/87', '1/100', '1/120', '1/148', '1/160', '1/200']

    if(make != "" && model !="" && year!="" && scale!="" && color!=""){
        if(!requiredFieldsSet){
            setRequiredFieldsSet(true)
        }
    }else if(requiredFieldsSet){
        setRequiredFieldsSet(false)
    }

    async function compressImages(){
        const compressed = []
        Array.from(images).map(async(img)=>{
            const compressedImg = await compressImageToWebpFormat(img)
            compressed.push(compressedImg)
        })
        setCompressedImages(compressed)
        setTimeout(() => {
            setDoneUploadingImages(!doneUploadingImages)
        }, 2000);
    }

    async function imagesToAWSbucket(){
        const uploadedURLs = []
        const selectedImages = compressedImages;
        for(const img of selectedImages){
            const response = await fetch('https://mycarcollectionapi.onrender.com/api/aws')
            const responseData = await response.json()
            const urlToPost = responseData.data
            const opts = {
                method: 'PUT',
                headers: {"Content-Type" : "image/webp"},
                body : img
            }
            await fetch(urlToPost,opts)
            const imgUrl = urlToPost.split('?')[0]
            uploadedURLs.push(imgUrl)
        }
        

        return uploadedURLs
    }

    async function newCarToApi(urls, make, model, color, year, scale, manufacturer, notes, opened, series, seriesNum){
        const url ='https://mycarcollectionapi.onrender.com/api/cars'
        const data = {
            carMake : make,
            carModel : model,
            carColor : color,
            carYear : year,
            scale,
            userId : '67643865a1ec5563d6e2314d'
        }
        if(manufacturer!=""){data.manufacturer = manufacturer}
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
        if(make=="" || model==""|| color==""|| year==""|| scale=="" ){
            return false
            
        }
        
        
        const imgUrls = await imagesToAWSbucket()       
        const added = await newCarToApi(imgUrls, make, model, color, year, scale, manufacturer, notes, opened, series, seriesNum, collection)
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
            setMoreInfoVisibility("none")
            setDoneUploadingImages(true)
    }

    const handleCarMakeInput = (e)=>{
        setMake(e.target.value)
    }
    
    const handleCarModelInput = (e)=>{
        setModel(e.target.value)
    }

    const handleCarYearInput = (e)=>{
        setYear(e.target.value)
    }

    const handleCarColorInput = (e)=>{
        setColor(e.target.value)
    }

    const handleScaleSelect = (e)=>{
        setScale(e.target.value)
    }

    const handleCarManufacturerInput = (e)=>{
        setManufacturer(e.target.value)
    }

    const handleCarNotesInput = (e)=>{
        setNotes(e.target.value)
    }

    const handleCarOpenedSelect = (e)=>{
        setOpened(e.target.value)
    }

    const handleCarSeriesInput = (e)=>{
        setSeries(e.target.value)
    }

    const handleCarSeriesNumberInput = (e)=>{
        setSeriesNum(e.target.value)
    }

    const handleCarCollectionSelect = (e)=>{
        setCollection(e.target.value)
    }

    const handleMoreInfoClick = ()=>{
        moreInfoVisibility =="none" ? setMoreInfoVisibility("flex") : setMoreInfoVisibility("none")
    }

    const compressImageToWebpFormat = async(img)=>{
        const opts = {
            maxSizeMB : 1,
            fileType: 'image/webp',
            useWebWorker : true
        }
        const compressedImage = await imageCompression(img, opts)
        
        return compressedImage
    }

    

    


    const handleNewImg=async(e)=>{
        setDoneUploadingImages(!doneUploadingImages)
        setImages(e.target.files)
        
    }

    
    useEffect(()=>{
        images.length>0 ?
        compressImages()
        : null
    },[images])
    
    

    useEffect(()=>{
        const url= `https://mycarcollectionapi.onrender.com/api/carcollections?userId=${loggedUserId}`
        async function getUserCollections(){
            const usrCollections = await fetch(url)
            const usrCollectionsData = await usrCollections.json()
            setUserCollections(usrCollectionsData.data)
        }
        getUserCollections()
    },[])
    
    
    return(
        <section className='addCarForm-section'>
            <label htmlFor='carMakeInput'>*Marca</label>
            <input type="text" name='carMake' id='carMakeInput' value={make} onChange={handleCarMakeInput} placeholder='e: Ford' />
            <label htmlFor='carModelInput'>*Modelo</label>
            <input type="text" name='carModel' id='carModelInput' value={model} onChange={handleCarModelInput} placeholder='e: Fiesta' />
            <label htmlFor='carYearSelectInput'>*Año</label>
            <select name='carYear' id='carYearSelectInput' value={year} onChange={handleCarYearInput} placeholder='e: 2019' >
                <option value={""}></option>
                {yearsToSelect.map((yearSelect)=>{
                    return(
                        <option key={yearSelect} value={yearSelect}>{yearSelect}</option>
                    )
                })}
            </select>
            <label htmlFor='carColorInput'>*Color</label>
            <input type="text" name='carColor' id='carColorInput' value={color} onChange={handleCarColorInput} placeholder='e: Blanco' />
            <label htmlFor='carScaleSelectInput'>*Escala</label>
            <select name="carScale" id="carScaleSelectInput" value={scale} onChange={handleScaleSelect} >
                <option value={""}></option>
                {
                    scaleList.map((scaleItem)=>{
                        return(
                            <option key={scaleItem} value={scaleItem}>{scaleItem}</option>
                        )
                    })
                }
            </select>
            <label htmlFor='carManufacturerInput'>Fabricante</label>
            <input type="text" name='carManufacturer' id='carManufacturerInput' value={manufacturer} onChange={handleCarManufacturerInput} placeholder='e: Hotwheels'/>
            <label htmlFor='carImagesInput'>Imágenes</label>
            <input type="file" multiple id='carImagesInput' accept='image/*' onChange={(e)=>{handleNewImg(e)}} />
            <section className='AddCarForm-imgSection'>
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

            <button id='AddCarFormMoreInfoButton' onClick={handleMoreInfoClick}>Agregar más info</button>

            <section className='addCarForm-section AddCarForm-moreDataSection' style={moreDataSectionStlyles} >
                <label htmlFor='carNotesInput'>Notas</label>
                <textarea type="text" name='carNotes' id='carNotesInput' value={notes} onChange={handleCarNotesInput} placeholder='e: Regalo de navidad' rows={4}/>
                <label htmlFor='carOpenedSelectInput'>Estado del paquete</label>
                <select name="carOpened" id="carOpenedSelectInput" value={opened} onChange={handleCarOpenedSelect}  >
                    <option value={""}></option>
                    <option value='opened'>Abierto</option>
                    <option value='sealed'>Cerrado</option>
                </select>
                <label htmlFor='carSeriesInput'>Series</label>
                <input type="text" name='carSeries' id='carSeriesInput' value={series} onChange={handleCarSeriesInput} placeholder='e: Hotwheels´s MUSCLE MANIA'  />
                <label htmlFor='carSeriesNumberInput'>Nro Serie</label>
                <input type="text" name='carSeriesNumber' id='carSeriesNumberInput' value={seriesNum} onChange={handleCarSeriesNumberInput} placeholder='e: 44/100'/>
                <label htmlFor='carCollectionSelectInput'>Colección</label>
                <select name="carCollection" id="carCollectionSelectInput" value={collection} onChange={handleCarCollectionSelect}>
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
            </section>
            <button id='addCarFormSaveButton' onClick={handleAddCarButtonClick} disabled={!doneUploadingImages || !requiredFieldsSet } >
                Guardar
            </button>
            
        </section>
    )
}