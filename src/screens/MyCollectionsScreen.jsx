import { useContext, useEffect } from 'react'
import styles from './MyCollectionsScreen.module.css'
import { AppContext } from '../context/AppContext'
import { Header } from '../components/Header'
import { CollectionCard } from '../components/CollectionCard'

export function MyCollectionsScreen(){
    const {loggedUserId, userCollections, setUserCollections, loggedUserName, loggedUserProfilePicture, handleLogOut} = useContext(AppContext)

    useEffect(()=>{
        if(!loggedUserId) return
        const collectionsUrl= `https://mycarcollectionapi.onrender.com/api/carcollections?userId=${loggedUserId}`
        async function getUserCollections(){
            const response = await fetch(collectionsUrl)
            const responseData = await response.json()
            if(response.status==200){
                setUserCollections(responseData.data)
            }
        }
        console.log({userCollections, loggedUserId})
        if(!userCollections){
            getUserCollections()
        }
    },[])

    return(
        <span className={styles.screenContainer}>
            <Header loggedUserName={loggedUserName} loggedUserProfilePicture={loggedUserProfilePicture} handleLogOut={handleLogOut} />
            <h1 className={styles.screenTitle}>myCollectionsScreen</h1>
            <div className={styles.mainContainer}>
                <div className={styles.newColSection}></div>
                <div className={styles.userCols}>
                    {
                        userCollections?.map((collection)=>{
                            return <CollectionCard collection={collection} />
                        })
                    }
                </div>
            </div>
        </span>
    )
}