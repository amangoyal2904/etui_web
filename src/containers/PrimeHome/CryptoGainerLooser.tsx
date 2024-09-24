'use client'
import React, { useState,useEffect } from "react";
import API_CONFIG from "../../network/config.json";
import CryptoChart from "./CryptoChart";
const CryptoGainerLooser = () => {
    const [gainers,setGainers] = useState("gainers");
    const [data,setData] = useState([]);
    useEffect(()=>{
        getData();
        const timer = setInterval(getData,24e3);
        return () => clearInterval(timer);
    },[gainers]);
    const getData = async() =>{
        try{
            const API_URL = API_CONFIG.cryptoDomain['production'] + '/ET_Cryptocurrency/cryptocurrencystats?statstype=' + gainers;
            const response = await fetch(API_URL);
            const apiData = await response.json();
            setData(apiData?.searchresult || []);
        }
        catch(e){
            console.error("Gainer API failed",e);
        }
    }
    const handleTab = (tab : string) => {
        setGainers(tab);
    }
    return (
      <>
        <CryptoChart />
        <div className="tabs">
          <div className={gainers == "gainers" ? "active" : ""} onClick={() => handleTab("gainers")}>
            Top gainers
          </div>
          <div className={gainers != "gainers" ? "active" : ""} onClick={() => handleTab("losers")}>
            Top losers
          </div>
        </div>
        <ul className="gainer_looser">
          {data?.map((val: any, index) => {
            if (index > 3) return;
            return (
              <li key={`gainer_loser${index}`}>
                <a className="coin_name" href={val?.pageUrl} title={val?.coinName}>
                  {val?.coinName}
                </a>
                <div>
                  {val?.price?.toFixed(2)}
                  <span className={val?.percentChange > 0 ? "gain" : val?.percentChange < 0 ? "loss" : "nogainloss"}>
                    ({val?.percentChange?.toFixed(2)}%)
                  </span>
                </div>
              </li>
            );
          })}
          {data.length == 0 && <div>No Data Available</div>}
        </ul>
        <style jsx>{`
          .tabs {
            display: flex;
          }
          .tabs div {
            width: 50%;
            text-align: center;
            text-transform: uppercase;
            border: solid 1px #183651;
            background-color: #fff;
            padding: 4px 0;
            font-size: 10px;
            cursor: pointer;
          }
          .tabs div.active {
            color: #fff;
            font-weight: 600;
            background-color: #183651;
          }
          .gainer_looser {
            list-style: none;
            margin-top: 12px;
          }
          .gainer_looser li {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #ddc2bb;
            font-size: 11px;
          }
          .gainer_looser li div {
            font-size: 12px;
          }
          .gainer_looser li div > span {
            margin-left: 2px;
          }
          .gainer_looser .gain {
            color: #009060;
          }
          .gainer_looser .loss {
            color: #da2337;
          }
        `}</style>
      </>
    );
}
export default CryptoGainerLooser;