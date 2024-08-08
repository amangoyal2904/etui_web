import styles from "./styles.module.scss"
import OnboardingSilde from '../../components/OnboardingSilde';
import { Suspense } from "react";

export default async function Page() {
    const year = new Date().getFullYear();

    const fetchHit = async () => {
        let serviceUrl = 'https://etonboard-stg.economictimes.indiatimes.com/etonboard/api/v2/fetchQuestionnaire.json';
    
        // Parameters to be sent with the GET request
        const params = new URLSearchParams({
            isPaidUser: 'true',
            email: "testonboarding@givmail.com",
            isEdit: 'true'
        });
    
        try {
            // Fetching the questionnaire data
            const fetchQues = await fetch(`${serviceUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': "ad7qnu3xtwikuv358ln9pftex",
                    'Content-Type': 'application/json'
                }
            });
    
            // Checking if the response is OK (status code 200-299)
            if (!fetchQues.ok) {
                throw new Error(`HTTP error! Status: ${fetchQues.status}`);
            }
    
            // Parsing the response to JSON
            const jsonFetchQues = await fetchQues.json();

            return jsonFetchQues;
            
            // Logging the response
            //console.log("jsonFetchQues", jsonFetchQues);
            
            // Call the function to handle the response data
            // objObd.createOnd(jsonFetchQues);
        } catch (error) {
            return {};
            // Logging any error that occurs during the fetch process
            console.error('Error fetching the questionnaire:', error);
        }
    };
    
    // Call the function
    const fetchQuesData = await fetchHit();

    return <>
        <header className={`${styles.headerWrp} ${styles.tac}`}>
            <a href="/" title="The Economic Times">
                <img src="https://img.etimg.com/photo/msid-74451948,quality-100/et-logo.jpg" alt="The Economic Times" width="255" />  
            </a>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardingSilde fetchQuesData={fetchQuesData} pageType={'page'} />
        </Suspense>
        
        <footer className={styles.footerWrp}>
            <ul className={`${styles.ftListWrp}`}>
                <li>
                    <a href="https://economictimes.indiatimes.com/prime/help" target="_blank">Customer Service</a>
                </li>
                <li>
                    <span className={styles.pipe}> | </span>
                    <a href="https://economictimes.indiatimes.com/privacypolicy.cms" target="_blank">Privacy Policy</a>
                    <span className={styles.pipe}> | </span>
                </li>
                <li>
                    <a href="https://economictimes.indiatimes.com/terms-conditions" target="_blank">Terms of Use</a>
                </li>
            </ul>
            <p className={`${styles.tac} ${styles.copyrightWrp}`}>COPYRIGHT © {year} TIMES INTERNET LIMITED. ALL RIGHTS RESERVED.</p>
        </footer>
    </>
  }