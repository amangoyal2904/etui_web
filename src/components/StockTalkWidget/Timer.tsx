import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const Timer = (props) => {
    const [min, setMin] = useState(['0','0']);
    const [sec, setSec] = useState(['0','0']);
    const [hr, setHr] = useState(['0','0']);

    useEffect(() => {
        if(props?.time) {
            countdownTimeStart(props.time || 0);
        }
    }, []);

    const countdownTimeStart = (ts) => {
        let x = setInterval(function() {
            const now = new Date().getTime();
            const timeLeft = ts - now;
            
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
            const ehr = hours > 10 ? hours.toString() : '0'+hours;
            const emin = minutes > 10 ? minutes.toString() : '0'+minutes;
            const esec = seconds > 10 ? seconds.toString() : '0'+seconds;
            
            setHr([ehr.split('')[0], ehr.split('')[1]]);
            setMin([emin.split('')[0], emin.split('')[1]]);
            setSec([esec.split('')[0], esec.split('')[1]]);
        
            if (timeLeft < 0) {
                clearInterval(x);
                props.streamData();
            }
        }, 999);
    }

    return <div className={styles.timer_widget}>
        <p className={styles.timer_heading}>STARTS IN</p>
        <div className={styles.timer_container}>
            <div className={`${styles.hrs} ${styles.tac}`}>
                <div className={styles.timer}>
                    <span>{hr[0]}</span>
                    <span>{hr[1]}</span>
                </div>
                <p>HRS</p>
            </div>
            <div className={`${styles.min} ${styles.tac}`}>
                <div className={styles.timer}>
                    <span>{min[0]}</span>
                    <span>{min[1]}</span>
                </div>
                <p>MINS</p>
            </div>
            <div className={`${styles.sec} ${styles.tac}`}>
                <div className={styles.timer}>
                    <span>{sec[0]}</span>
                    <span>{sec[1]}</span>
                </div>
                <p>SECS</p>
            </div>
        </div>
    </div>
}

export default Timer;