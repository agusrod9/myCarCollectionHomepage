import { useContext, useEffect, useState } from 'react'
import styles from './FiltersPanel.module.css'
import { AppContext } from '../context/AppContext'
import {ActionBtn} from './ActionBtn'
import { BrushCleaning } from 'lucide-react'

export function FiltersPanel({className, setSelectedFilters, selectedFilters}){
    const {loggedUserId} = useContext(AppContext)
    const [availableFilters, setAvailableFilters] = useState({})
    
    const FILTER_LABELS = {
        availableManufacturers : 'Manufacturer',
        availableCarMakes : 'Make',
        availableScales : 'Scale',
        availablePrices : 'Price'
    }

    const clearAllFilters = ()=>{
        setSelectedFilters({
            availableManufacturers : [],
            availableCarMakes : [],
            availableScales : [],
            availablePrices : []
        })
    }

    useEffect(()=>{

        let getFilters = async()=>{
            let response = await fetch(`https://mycarcollectionapi.onrender.com/api/filters?userId=${loggedUserId}`)
            let responseData = await response.json()
            setAvailableFilters(responseData.data)
        } 
        getFilters()
    },[])
    return(
        <span className={className}>
            {
                Object.entries(availableFilters).map(([key, values])=>(
                    <div key={key} className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>
                            {FILTER_LABELS[key]}
                        </h3>

                        {values.map((val,i)=>(
                            <label key={i} className={styles.filterLabel}>
                                <input 
                                    type="checkbox"
                                    value={val}
                                    checked={selectedFilters[key]?.includes(val) || false}
                                    className={styles.filterCheck}
                                    onChange={(e)=>{
                                        const checked = e.target.checked
                                        setSelectedFilters(prev=>{
                                            const current = prev[key] || [];
                                            return {
                                                ...prev,
                                                [key] : checked
                                                ?
                                                [...current, val]
                                                :
                                                current.filter(v=> v!= val)
                                            };
                                        });
                                    }}
                                />
                                {val || "•Not Specified"}
                            </label>
                        ))}
                    </div>
                ))
            }
            <ActionBtn label={'Clear All'} icon={<BrushCleaning/>} onClick={clearAllFilters}/>
        </span>
    )
}