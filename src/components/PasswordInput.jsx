import { useState } from "react";
import styles from './PasswordInput.module.css';
import { Eye, EyeClosed } from "lucide-react";

export default function PasswordInput({className, value, placeholder, onChange, onKeyDown,  iconSize=20}){
    const [show, setShow] = useState(false)

    return(
        <div className={`${styles.passwordInputContainer}`}>
            <input 
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className={styles.pwdInput}
            />
            <button
                type="button"
                onMouseDown={() => setShow(true)}
                onMouseUp={() => setShow(false)}
                onMouseLeave={() => setShow(false)}
                className={styles.passwordToggleBtn}
            >
                {show ? <Eye size={iconSize} /> : <EyeClosed size={iconSize} />}
            </button>
        </div>
    )
}