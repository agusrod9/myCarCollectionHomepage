import styles from './SocialLinksModal.module.css'
import { faInstagram, faTiktok, faFacebook, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import validator from 'validator'

export function SocialLinkModal({editData, onSave, onCancel}){
    const [platform, setPlatform] = useState("")
    const [url, setUrl] = useState("")
    const [alias, setAlias] = useState("")
    const [isOkToSave, setIsOkToSave] = useState(false)

    const options =[{
            id: 'ig',
            icon : faInstagram,
            label : `Instagram`,
        },{
            id: 'tk',
            icon : faTiktok,
            label : `TikTok`,
        },{
            id: 'fb', 
            icon : faFacebook,
            label : `Facebook`,
        },{
            id: 'x',
            icon : faXTwitter,
            label : `X (twitter)`,
        },{
            id: 'yt',
            icon : faYoutube,
            label : `YouTube`,
        },{
            id: 'ws',
            icon : faEarthAmericas,
            label : `Web site`,
        }
    ]

    function normalizeUrl(input) {
        if (!input) return '';

        const trimmed = input.trim();

        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }

        return `https://${trimmed}`;
    }

    const handleSaveOrEdit = ()=>{
        let mode = null;
        if(editData){
            mode = 'edit'
        }else{
            mode = 'create'
        }
        if(
            !platform ||
            !url 
        ){
            toast.error("Error updating social links.", {duration: 2500})
            return
        }
        const normalizedUrl = normalizeUrl(url)
        if(!validator.isURL(normalizedUrl)){
            toast.error("Please enter a valid URL", {duration: 2500})
            return
        }
        const option = options.find(opt => opt.id === platform)
        let dataToSave = null;
        if(mode==='edit'){
            dataToSave={
                platform,
                url : normalizedUrl,
                alias,
                label : option.label,
                _id : editData._id
            }
        }else{
            dataToSave={
                platform,
                url : normalizedUrl,
                alias,
                label : option.label
            }
        }
        onSave(dataToSave, mode)
    }

    const handleCancel =()=>{
        setPlatform("")
        setUrl("")
        setAlias("")
        onCancel()
    }

    useEffect(()=>{
        if(editData){
            setPlatform(editData.platform)
            setAlias(editData.alias)
            setUrl(editData.url)
        }
    },[editData])

    useEffect(()=>{
        if(
            !platform ||
            !url 
        ){
            return
        }
        setIsOkToSave(true)
    },[platform, url, alias])

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.platformBtnContainer}>
                    {options.map(opt=>(
                        <button 
                            className={opt.id===platform ? `${styles.platformButton} ${styles.activePlatform}` : `${styles.platformButton}`}
                            onClick={()=>setPlatform(opt.id)}
                        >
                            <FontAwesomeIcon icon={opt.icon}/>
                            <p>{opt.label}</p>
                        </button>
                    ))}
                </div>
                <div className={styles.inputContainer}>

                    <label htmlFor="urlInput">Link url</label>
                    <input 
                        type="text"
                        value={url}
                        onChange={(e)=> setUrl(e.target.value)}
                    />
                    <label htmlFor="aliasInput">Alias (optional)</label>
                    <input 
                        type="text"
                        value={alias}
                        onChange={(e)=> setAlias(e.target.value)}
                    />
                </div>
                <div className={styles.btnContainer}>
                    <button
                        type='button' 
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        type='button'
                        onClick={handleSaveOrEdit}
                        disabled={!isOkToSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}