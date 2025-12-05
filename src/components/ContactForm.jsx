import { useState } from 'react';
import styles from './ContactForm.module.css';
import { capitalize } from '../utils/textUtils.js';
import validator from 'validator';
import toast from 'react-hot-toast';

const API_BASEURL = import.meta.env.VITE_API_BASEURL;
export default function ContactForm(){
    const [error, setError] = useState("");
    const [attachmentFile, setAttachmentFile] = useState(null)
    const [formData, setFormData] = useState({
        name : "",
        email : "",
        topic : "",
        message : "",
        attachmentUrl : "",
        sendCopy : false,
        channel : "web"
    });
    
    const clearFormData=()=>{
        setFormData({
            name : "",
            email : "",
            topic : "",
            message : "",
            attachmentUrl : "",
            sendCopy : false,
            channel : "web"
        })
    }

    const handleFormSubmit = async(e)=>{
        e.preventDefault()

        if(!formData.name || !formData.email || !formData.name || !formData.message ){
            setError("All fields are required.");
            return
        }

        if(formData.name.length <6){
            setError("Please enter your full name.");
            return
        }
        
        if(!validator.isEmail(formData.email)){
            setError("Invalid E-Mail.");
            return
        }

        if(!formData.topic){
            setError("Please select a topic.");
            return
        }

        if(formData.message.length <25){
            setError("Please enter a more detailed message (at least 25 characters).");
            return
        }

        if(formData.message.length >1000){
            setError("Your message is too long. Please keep it under 1000 characters.");
            return
        }
        const t = toast.loading("Sending your message...",{duration: 5000})
        const url = `${API_BASEURL}contacts`;
        const opts = {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(formData)
        }
        const response = await fetch(url,opts);
        if(response.status===201){
            toast.success("Thanks! We’ve received your message.",{duration: 2500, id:t});
            clearFormData()
        }else{
            toast.error("Something went wrong. Please try again.", {duration : 2500, id:t});
        }

    }

    return(
        <div className={styles.contactFormContainer}>
            <form onSubmit={handleFormSubmit} className={styles.contactForm}>
                <label htmlFor="">Name</label>
                <input type="text" placeholder='Type your name' value={formData.name} onChange={(e)=>{
                    setError("")
                    setFormData({...formData, name: capitalize(e.target.value, true)})
                }}/>
                <label htmlFor="">E-Mail</label>
                <input type="text" placeholder='Type your E-Mail' value={formData.email} onChange={(e)=>{
                    setError("")
                    setFormData({...formData, email: e.target.value})
                }}/>
                <label htmlFor="">Select a topic</label>
                <select value={formData.topic} onChange={(e)=>{
                    setError("")
                    setFormData({...formData, topic: e.target.value})
                }}>
                    <option value="">Select...</option>
                    <option value="acc_support">Account support</option>
                    <option value="business_inq">Business inquiry</option>
                    <option value="contact_dev">Contact the developer</option>
                    <option value="not_working">Something isn’t working</option>
                    <option value="subs_support">Subscription support</option>
                    <option value="feature_req">Suggest a feature</option>
                    <option value="other">Other</option>
                </select>
                <label htmlFor="">Message</label>
                <textarea name="" id="" className={styles.messageInput} placeholder='Write your message…' value={formData.message} onChange={(e)=>{
                    setError("")
                    setFormData({...formData, message: (e.target.value)})
                }}>

                </textarea>
                <label htmlFor="">Attachment (optional)</label>
                <input
                    type="file"
                    id='contactAttachment'
                    name='contactAttachment'
                    accept='.jpg,.jpeg,.png,.pdf,.heic,.heif'
                    onChange={(e)=> setAttachmentFile(e.target.files[0] || null)}

                />
                <div className={styles.checkContainer}>
                    <input 
                        type="checkbox"
                        id='sendCopy'
                        name='sendCopy'
                        checked={formData.sendCopy}
                        onChange={(e)=>{
                            setFormData({...formData, sendCopy: e.target.checked})
                        }}      
                    
                    />
                    <label htmlFor="">Send me a copy</label>
                </div>
                <p className={styles.formErrorLabel}>{error}</p>

                <button
                    type='submit'
                >
                    Send
                </button>
            </form>
        </div>
    )
}