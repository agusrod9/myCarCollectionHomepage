import styles from './CollectionCard.module.css'
import { formatDate } from '../utils/dates.util'
import { Globe, UsersRound, Lock } from 'lucide-react'

export function CollectionCard({collection}){
    const placeholder = "https://user-collected-cars-images-bucket.s3.us-east-2.amazonaws.com/public/placeholder.webp"
    return(
        <div className={styles.colCardContainer}>
            <img src={collection.coverImg!= "" ? collection.coverImg : placeholder} alt="" className={styles.colImg} />
            <p className={styles.colName}>{collection.collectionName}</p>
            <p className={styles.colDesc}>{collection.description}</p>
            <p className={styles.colDate}>{formatDate(collection.dateAdded)}</p>
            <p className={styles.colPrivacy}>{collection.visibility}</p>
            {collection.visibility=="public" ? <Globe/> : collection.visibility=="private" ? <Lock/> : <UsersRound/>}
        </div>
    )
}