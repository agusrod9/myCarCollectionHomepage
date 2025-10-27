import styles from './CollectionCard.module.css'

export function CollectionCard({collection}){
    return(
        <div className={styles.collectionCardContainer}>
            <img src={collection.coverImg} alt="" className={styles.colImg} />
            <p>{collection.colName}</p>
            <p>{collection.colDescription}</p>
            <p>{collection.colDateAdded}</p>
        </div>
    )
}