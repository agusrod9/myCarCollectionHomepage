import { useEffect, useState } from 'react'
import './AddCarForm.css'
import base64 from 'base64-encode-file'

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
    const [moreInfoVisibility, setMoreInfoVisibility] = useState("none")
    const [images, setImages] = useState([])
    const [convertedImages, setConvertedImages] = useState([])

    const moreDataSectionStlyles = {display : moreInfoVisibility}
    const yearsToSelect =[]
    const today = new Date()
    for(let i=today.getFullYear(); i>= 1885 ; i--){
        yearsToSelect.push(i)
    }

    async function newCarToApi(make, model, color, year, scale, manufacturer, notes, opened, series, seriesNum) {
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
        if(convertedImages.length>0){data.img_urls = convertedImages}
        const opts = {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        }
        console.log({dataenviadaEnBody : data});
        
        const response = await fetch(url,opts)
        const responseData = await response.json()
        return responseData
    }

    const handleAddCarButtonClick = async(e)=>{
        e.preventDefault()
        if(make=="" || model==""|| color==""|| year==""|| scale=="" ){
            return false
            
        }
        collection=="" ? setCollection(null) : null
        opened=="" ? setOpened(null) : null
        const added = await newCarToApi(make, model, color, year, scale, manufacturer, notes, opened, series, seriesNum, collection)
        console.log(added)
        
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

    const imagesToBase64 = async()=>{
        const converted = []
        Array.from(images).map(async(img)=>{
            const base = await base64(img)
            converted.push(base)
        })
        setConvertedImages(converted)
    }

    const handleNewImg=async(files)=>{
        setImages(files)
    }

    useEffect(()=>{
        images.length>0 ?
        imagesToBase64()
        : null
    },[images])
    

    
    return(
        <section className='addCarForm-section'>
            <label htmlFor='carMakeInput'>*Marca</label>
            <input type="text" name='carMake' id='carMakeInput' value={make} onChange={handleCarMakeInput} placeholder='e: Ford' />
            <label htmlFor='carModelInput'>*Modelo</label>
            <input type="text" name='carModel' id='carModelInput' value={model} onChange={handleCarModelInput} placeholder='e: Fiesta' />
            <label htmlFor='carYearInput'>*Año</label>
            <select name='carYear' id='carYearSelectInput' value={year} onChange={handleCarYearInput} placeholder='e: 2019' >
                <option value={null}></option>
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
                <option value={null}></option>
                <option value="1/5">1/5</option>
                <option value="1/8">1/8</option>
                <option value="1/10">1/10</option>
                <option value="1/12">1/12</option>
                <option value="1/18">1/18</option>
                <option value="1/24">1/24</option>
                <option value="1/32">1/32</option>
                <option value="1/36">1/36</option>
                <option value="1/43">1/43</option>
                <option value="1/64">1/64</option>
                <option value="1/72">1/72</option>
                <option value="1/87">1/87</option>
                <option value="1/144">1/144</option>
                <option value="1/160">1/160</option>
            </select>
            <label htmlFor='carManufacturerInput'>Fabricante</label>
            <input type="text" name='carManufacturer' id='carManufacturerInput' value={manufacturer} onChange={handleCarManufacturerInput} placeholder='e: Hotwheels'/>
            <label htmlFor='carImagesInput'>Imágenes</label>
            <input type="file" multiple id='carImagesInput' accept='image/*' onChange={(e)=>{handleNewImg(e.target.files)}} />
            <section className='AddCarForm-imgPreviewSection'>
            {
                Array.from(images).map((img)=>{
                    return(
                            <img key={img.name} className='imgPrueba' src={URL.createObjectURL(img)} />
                        )
                    })
                }
            </section>

            <button id='AddCarFormMoreInfoButton' onClick={handleMoreInfoClick}>Agregar más info</button>

            <section className='AddCarForm-moreDataSection' style={moreDataSectionStlyles} >
                <label htmlFor='carNotesInput'>Notas</label>
                <input type="text" name='carNotes' id='carNotesInput' value={notes} onChange={handleCarNotesInput} placeholder='e: Regalo de navidad'/>
                <label htmlFor=''>Estado del paquete</label>
                <select name="carOpened" id="carOpenedSelectInput" value={opened} onChange={handleCarOpenedSelect}  >
                    <option value={null}></option>
                    <option value='opened'>Abierto</option>
                    <option value='sealed'>Cerrado</option>
                </select>
                <label htmlFor='carSeriesInput'>Series</label>
                <input type="text" name='carSeries' id='carSeriesInput' value={series} onChange={handleCarSeriesInput} placeholder='e: Hotwheels´s MUSCLE MANIA'  />
                <label htmlFor=''>Nro Serie</label>
                <input type="text" name='carSeriesNumber' id='carSeriesNumberInput' value={seriesNum} onChange={handleCarSeriesNumberInput} placeholder='e: 44/100'/>
                <label htmlFor=''>Colección</label>
                <select name="carCollection" id="carCollectionSelectInput" value={collection} onChange={handleCarCollectionSelect}>
                    <option value={null}></option>
                    <option value={"a"}>Colección "asas" del usuario - Fetch</option>
                    <option value={"b"}>Colección "wplf" del usuario - Fetch</option>
                    <option value={"c"}>Colección "sdsd" del usuario - Fetch</option>
                    <option value={"d"}>Colección "vtun" del usuario - Fetch</option>
                    <option value={"e"}>Colección "derj" del usuario - Fetch</option>
                    <option value={"f"}>Colección "fddf" del usuario - Fetch</option>
                </select>
            </section>
            <button id='addCarFormSaveButton' onClick={handleAddCarButtonClick}>
                Guardar
            </button>
            
                
            
        </section>
    )
}