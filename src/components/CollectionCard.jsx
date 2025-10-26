import styles from './CollectionCard.module.css'

export function CollectionCard({collection}){
    return(
        <div className={styles.collectionCardContainer}>
            <p>{collection.collectionName}</p>
            <p>{collection.description}</p>
            <p>{collection.dateAdded}</p>
        </div>
    )
}