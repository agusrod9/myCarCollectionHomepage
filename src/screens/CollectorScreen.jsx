import { useParams } from 'react-router';
import styles from './CollectorScreen.module.css';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';

export default function CollectorScreen(){
    const API_BASEURL = import.meta.env.VITE_API_BASEURL;
    const {collectorUserName} = useParams()
    const [collector, setCollector] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        setLoading(true)
        const getCollector = async()=>{
            const response = await fetch(`${API_BASEURL}collectors/${collectorUserName}`)
            const responseData = await response.json()
            if(Array.isArray(responseData.data) && responseData.data.length===0){
                setCollector(null)
            }else{
                setCollector(responseData.data)
            }
            setLoading(false)
        }
        getCollector()
    },[collectorUserName])



    if(loading){
        return <Loading />
    }

    return(
        <section className={styles.root}>
            {collector ?
                <h1>{`Collector ${collector?.firstName}`}</h1>
                :
                <h1>NO EXISTE</h1>
            }
        </section>
    )
}