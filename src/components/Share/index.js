import React from 'react'
import styles from './Share.module.scss'
import SocialShare from "../../utils/socialShare";


export default function Share({ children }) {
	let path = (typeof window !== 'undefined') ? window.location.pathname : '';
	let shareParam = {
		title: "",
		url: 'https://economictimes.indiatimes.com' + path
	}
	return (
		<div className={styles.wContainer}>
			<div className={styles.iconContainer}>
				<span className={`${styles.fb} socialSprite`} onClick={e => SocialShare.Share(e, { ...shareParam, type: "fb" })}></span>
				<span className={`${styles.twt} socialSprite`} onClick={e => SocialShare.Share(e, { ...shareParam, type: "twt" })}></span>
				<span className={`${styles.in} socialSprite`} onClick={e => SocialShare.Share(e, { ...shareParam, type: "lin" })}></span>
				<span className={`${styles.wa} socialSprite`} onClick={e => SocialShare.Share(e, { ...shareParam, type: "wa" })}></span>
			</div>
			{children}
		</div>
	)
}
