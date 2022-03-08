import React from 'react'
import styles from './Share.module.scss'


export default function Share(props) {
	let path = (typeof window !== 'undefined') ? window.location.pathname : '';
	let shareUrl  = 'https://economictimes.indiatimes.com' + path;
	const {iconClass, title} = props.data 
	
	return (
			<>
			<div className={styles.wContainer}>
				<div className={styles.iconContainer}>
					Share Icon
				</div>
			</div>
			</>
	)
}
