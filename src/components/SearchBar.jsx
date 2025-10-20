import { useRef, useState } from 'react'
import styles from './SearchBar.module.css'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

export function SearchBar({title, handleSearch}){
    const [query, setQuery] = useState("")
    const searchTimeOutRef = useRef(null)
    const [orderByMenuOpened, setOrderByMenuOpened] = useState(false)
    return(
        <section className={styles.SBContainer}>
            <p className={styles.SBTitle}>{title}</p>
            <div className={styles.SBSerchInput}>
                <input type="text" value={query} 
                onChange={(e)=>{
                    setQuery(e.target.value)
                    if(searchTimeOutRef.current) clearTimeout(searchTimeOutRef.current)
                    searchTimeOutRef.current = setTimeout(() => {
                        handleSearch(e.target.value)
                    }, 300);
                }}
                onKeyDown={(e)=>{
                    if(e.key=='Enter'){
                        handleSearch(query);
                    }}}
                />
                <Search size={30} onClick={()=>{
                    handleSearch(query);
                    } 
                }/>
            </div>
            <div className={styles.SBOrderBy} onClick={()=>{setOrderByMenuOpened(!orderByMenuOpened)}}>
                <p>Order by </p>
                {orderByMenuOpened ? <ChevronUp/> : <ChevronDown />}
            </div>
        </section>
    )
}