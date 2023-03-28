import React from 'react'
import styles from "./styles.module.scss";

const SearchBar = () => {
  return (
    <>
      <div className={styles.srch_container}>
        <div id="topSearch" className={styles.srch_overlay_div}>
          <div className={styles.srch_overlay_content}>
            <input autocomplete="off" data-search-input="" name="ticker_newsearch" class={styles.inputBox} placeholder="Search News, Stock Quotes &amp; NAV" value="" type="text" />
              <div className={styles.srch_btn}>Search</div>
              <div className={styles.srch_close}>+</div>``
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar
