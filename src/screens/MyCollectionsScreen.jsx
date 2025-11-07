import { useContext, useEffect, useState } from 'react'
import styles from './MyCollectionsScreen.module.css'
import { AppContext } from '../context/AppContext'
import { Header } from '../components/Header'
import { CollectionCard } from '../components/CollectionCard'
import { ActionBtn } from '../components/ActionBtn'
import { Save } from 'lucide-react'

export function MyCollectionsScreen(){
    const {loggedUserId, userCollections, setUserCollections, loggedUserName, loggedUserProfilePicture, handleLogOut} = useContext(AppContext)
    const [colCoverPreview, setColCoverPreview] = useState(null)
    const [colCoverFile, setColCoverFile] = useState(null)

    const handleColCoverSelect = (e)=>{
        const newFile = e.target.files[0];
        if(newFile){
            setColCoverFile(newFile);
            setColCoverPreview(URL.createObjectURL(newFile))
        }
    }
    const handleColCoverSubmit = (e)=>{
        e.preventDefault()
    }

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
        if(!userCollections){
            getUserCollections()
        }
    },[])

    return(
        <span className={styles.screenContainer}>
            <Header loggedUserName={loggedUserName} loggedUserProfilePicture={loggedUserProfilePicture} handleLogOut={handleLogOut} />
            <h1 className={styles.screenTitle}>myCollectionsScreen</h1>
            <div className={styles.mainContainer}>
                <div className={styles.newColSection}>
                    <p className={styles.newColSectionTitle}>Add new collection</p>
                    <div className={styles.newColSectionForm}>
                        <div className={styles.newColSectionFormItem}>
                            <label htmlFor="newColName">Name</label>
                            <input type="text" name='newColName' className={styles.newColSectionFormInput}/>
                        </div>
                        <div className={styles.newColSectionFormItem}>
                            <label htmlFor="newColDesc">Description</label>
                            <textarea name="newColDesc" className={styles.newColDesc}></textarea>
                        </div>
                        <div className={styles.newColSectionFormItem}>
                            <label htmlFor="newColCover" className={styles.newColCoverLabel}>
                            Select cover image
                            </label>
                            <input
                                type="file"
                                id='newColCover'
                                name='newColCover'
                                accept='image/*'
                                className={styles.newColCover}
                                onChange={handleColCoverSelect}
                            />
                            {colCoverPreview &&
                                <div className={styles.newColCoverPreviewContainer}>
                                    <img src={colCoverPreview} alt="New collection cover image preview." className={styles.newColCoverPreview} />
                                </div>
                            }
                            
                        </div>
                        <div className={styles.newColSectionFormItem}>
                            <label htmlFor="newColVisibility">Visibility</label>
                            <select name="newColVisibility" className={styles.newColSectionFormInput}>
                                <option value="public">Public</option>
                                <option value="friendsOnly">Friends</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <ActionBtn label='Add collection' icon={<Save />} disabled={false}/>
                    </div>
                </div>
                <div className={styles.userCols}>
                    {
                        userCollections?.map((collection)=>{
                            return <CollectionCard collection={collection} key={collection._id}/>
                        })
                    }
                </div>
            </div>
        </span>
    )
}