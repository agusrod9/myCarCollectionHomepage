import { useState } from 'react'
import styles from './SearchBar.module.css'
import { ChevronDown, Search } from 'lucide-react'

export function SearchBar({title, handleSearch}){
    const [query, setQuery] = useState("")
    return(
        <section className={styles.SBContainer}>
            <p>{title}</p>
            <div className={styles.SBSerchInput}>
                <input type="text" value={query} 
                onChange={(e)=>{
                    setQuery(e.target.value)
                    setTimeout(() => {
                        handleSearch(e.target.value)
                    }, 1000);
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
            <div className={styles.SBOrderBy}>
                <p>Order by </p>
                <ChevronDown />
            </div>
        </section>
    )
}