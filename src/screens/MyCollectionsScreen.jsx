import { useContext, useEffect, useState } from 'react'
import styles from './MyCollectionsScreen.module.css'
import { AppContext } from '../context/AppContext'
import { Header } from '../components/Header'
import { CollectionCard } from '../components/CollectionCard'
import { ActionBtn } from '../components/ActionBtn'
import { Save } from 'lucide-react'
import { convertToWebp, uploadSingleImage } from '../utils/images.utils'
import Loading from '../components/Loading'
import toast from "react-hot-toast";

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export function MyCollectionsScreen(){
    const {loggedUserId, userCollections, setUserCollections, loggedUserName, loggedUserProfilePicture, handleLogOut} = useContext(AppContext)
    const [colCoverPreview, setColCoverPreview] = useState(null)
    const [colCoverFile, setColCoverFile] = useState(null)
    const [okToSave, setOkToSave] = useState(false)
    const [loading, setLoading] = useState(true)
    const [newCollection, setNewCollection] = useState({
        description : "",
        collectionName : "",
        coverImg : "",
        visibility : "public",
        userId: loggedUserId
    })

    const resetNewCollectionState = ()=>{
        setNewCollection({
            description : "",
            collectionName : "",
            coverImg : "",
            visibility : "public",
            userId: loggedUserId});
        setColCoverFile(null);
        setColCoverPreview(null);
    }
    
    const handleColCoverSelect = async(e)=>{
        const newFile = e.target.files[0];
        if(newFile){
            const convertedFile = await convertToWebp(newFile);
            setColCoverFile(convertedFile);
            const previewUrl = URL.createObjectURL(convertedFile);
            setColCoverPreview(previewUrl)
        }
    }

    const handleSaveNewCollection = async()=>{
        const t= toast.loading("Creating new collection...", {duration:5000});
        let imageUrl=""
        if(colCoverFile){
            imageUrl = await uploadSingleImage(loggedUserId,"collectionCovers",colCoverFile)
        }
        const collectionToAdd = {...newCollection, coverImg: imageUrl};
        setNewCollection(prev=>({...prev, coverImg: imageUrl}))
        const url = `${API_BASEURL}/api/carcollections`
        const opts = {
            method: 'POST',
            headers : {'Content-Type' : 'application/json'},
            credentials: 'include',
            body: JSON.stringify(collectionToAdd)
        }
        const response = await fetch(url,opts)
        const responseData = await response.json();
        if (response.status==201){
            const addedCollection = responseData.data
            setUserCollections(prev=>([...prev, addedCollection]))
            resetNewCollectionState();
            setOkToSave(false)
            toast.success("Collection created!", {id: t, duration:2000})
        }else{
            console.log(responseData.error)
        }
    }

    useEffect(()=>{
        if(!loggedUserId) return
        async function getUserCollections(){
            setLoading(true);
            try {
                const collectionsUrl= `${API_BASEURL}/api/carcollections?userId=${loggedUserId}`
                const response = await fetch(collectionsUrl)
                const responseData = await response.json()
                if(response.status==200){
                    setUserCollections(responseData.data)
                }
            } catch (error) {
                console.log(`Error getting collections: ${error}`)
            } finally{
                setLoading(false);
            }
            
        }
        if(userCollections.length==0){
            getUserCollections()
        }else{
            setLoading(false);
        }
        
    },[loggedUserId])

    useEffect(()=>{
        setOkToSave(false)
        if(newCollection.collectionName!= ""){
            setOkToSave(true)
        }
    }, [newCollection.collectionName])

    if(loading) return <Loading />
    return(
        <span className={styles.screenContainer}>
            <Header loggedUserName={loggedUserName} loggedUserProfilePicture={loggedUserProfilePicture} handleLogOut={handleLogOut} />
            <h1 className={styles.screenTitle}>My collections</h1>
            <div className={styles.mainContainer}>
                <div className={styles.newColSection}>
                    <p className={styles.newColSectionTitle}>Add new collection</p>
                    <div className={styles.newColSectionForm}>
                        <div className={styles.newColSectionFormItem}>
                            <label htmlFor="newColName">Name</label>
                            <input 
                                type="text" 
                                value={newCollection.collectionName} 
                                name='newColName' 
                                className={styles.newColSectionFormInput} 
                                onChange={(e)=>{
                                    setNewCollection(prev=>({...prev, collectionName: e.target.value}))
                                }}
                            />
                        </div>
                        <div className={styles.newColSectionFormItem}>
                            <label htmlFor="newColDesc">Description</label>
                            <textarea 
                                name="newColDesc" 
                                value={newCollection.description} 
                                className={styles.newColDesc}
                                onChange={(e)=>{
                                    setNewCollection(prev=>({...prev, description: e.target.value}))
                                }}
                            />
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
                            <select 
                                name="newColVisibility" 
                                value={newCollection.visibility} 
                                className={styles.newColSectionFormInput}
                                onChange={(e)=>{
                                    setNewCollection(prev=>({...prev, visibility: e.target.value}))
                                }}
                            >
                                <option value="public">Public</option>
                                <option value="friendsOnly">Friends</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <ActionBtn 
                            label='Add collection' 
                            icon={<Save />} 
                            disabled={!okToSave} 
                            onClick={handleSaveNewCollection}/>
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