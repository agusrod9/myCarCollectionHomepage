import styles from './SocialLinkCard.module.css'
import { faInstagram, faTiktok, faFacebook, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faEarthAmericas, faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function SocialLinkCard({link, setLinkToBeEdited, setSocialLinkModalOpen}){
    let linkIcon = null;
    if(link.platform==='ig'){
        linkIcon = faInstagram
    }
    if(link.platform==='fb'){
        linkIcon = faFacebook
    }
    if(link.platform==='tk'){
        linkIcon = faTiktok
    }
    if(link.platform==='x'){
        linkIcon = faXTwitter
    }
    if(link.platform==='yt'){
        linkIcon = faYoutube
    }
    if(link.platform==='ws'){
        linkIcon = faEarthAmericas
    }

    const handleVisitLink =(url)=>{
        window.open(url,'_blank','noopener,noreferrer')
    }
    
    const handleEditLink =(link)=>{
        setLinkToBeEdited(link)
        setSocialLinkModalOpen(true)
    }

    return(
        <div className={styles.cardContainer}>
            <div className={styles.platformIconContainer}>
                <FontAwesomeIcon icon={linkIcon} size='xl'/>
            </div>
            <div 
                className={styles.mainContainer}
                onClick={()=>handleVisitLink(link.url)}
            >
                <p>{link.label} {link.alias ? link.alias : null}</p>
            </div>
            <div 
                className={styles.editIconContainer}
                onClick={(e)=>{
                    e.stopPropagation()
                    handleEditLink(link)
                }}
            >
                <FontAwesomeIcon icon={faEdit} size='lg' />
            </div>
        </div>
    )
}