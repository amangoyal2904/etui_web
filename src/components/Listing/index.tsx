import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "./styles.module.scss";
import useRequest from 'network/service'
import Loading from 'components/Loading';
import APIS_CONFIG from "network/config.json";
import Service from 'network/service';

const SampleListing: FC = () => {
    let [data, setData]:any = useState({});
    useEffect(() => {
        let url = APIS_CONFIG.REQUEST;
            let params = {
                type: "plist", "msid": 2146843
            };
            Service.get(url)
            .then(res => {
                setData(res.data || {});
                // console.log(res.data,"DataArticles");
            })
    }, []);

    const listData = data?.searchResult?.[0]?.["data"] || [];
    return (
        <ul className={styles.list}>
            {listData && listData.map(item => <li className={styles.list} key={item.msid}><Link href={item.url.replace("https://m.economictimes.com", "")}>{item.title}</Link></li>)}
        </ul>
    )
}

export default SampleListing;