import { faInstagram, faTiktok, faFacebook, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function SocialLinkCard({link}){
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
    return(
        <div>
            <FontAwesomeIcon icon={linkIcon} />
            <p>{`${link.label}  ${link.alias}`}</p>
            <p>{link.platform}</p>
            <p>{link.url}</p>
        </div>
    )
}