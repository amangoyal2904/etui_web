import React, { useState } from "react";
import { ET_WAP_URL, ET_WEB_URL } from "utils/common";
const CryptoExpert = ({ data, title = "" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  return (
    <>
      <div className="expert_container">
        <h2>{title}</h2>
        <ul>
          {data?.map((ele, index) => {
            return (
              <li key={ele.msid}>
                <img alt={ele?.title} src={ele?.img} loading="lazy" height="56" width="56" decoding="async"></img>
                <div className="details">
                  <a
                    href={ele?.url?.replace(ET_WAP_URL, ET_WEB_URL)}
                    title={ele?.title}
                    className="article"
                    target="_blank"
                    data-ga-onclick={`Subscriber Homepage#Cryptocurrency News widget click#Expert Speak - ${index+1} - href`}
                  >
                    {ele?.title}
                  </a>
                  {ele.authors && Array.isArray(ele.authors) && ele.authors.length && (
                    <a
                      href={ele?.authors[0]?.url?.replace(ET_WAP_URL, ET_WEB_URL)}
                      title={ele?.authors[0]?.title}
                      className="author"
                      target="_blank"
                      data-ga-onclick={`Subscriber Homepage#Cryptocurrency News widget click#Expert Speak - ${index+1} - href`}
                    >
                      {ele?.authors[0]?.title}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <style jsx>{`
        .expert_container {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 2px solid #000;
        }
        .expert_container h2 {
          border: none;
          margin: 0;
          font-size: 18px;
          padding: 0;
          text-transform: unset;
        }
        .expert_container h2::after {
          content: "";
          display: inline-block;
          width: 7px;
          height: 7px;
          top: -1px;
          left: 2px;
          border-top: 2px solid #ed193b;
          border-left: 2px solid #ed193b;
          position: relative;
          cursor: pointer;
          transform: rotate(135deg);
        }
        .expert_container ul {
          list-style: none;
        }
        .expert_container li {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #ddc2bb;
        }
        .expert_container li:last-child {
          border: none;
        }
        .expert_container .details {
          width: 187px;
        }
        .expert_container .article {
          font-family: Faustina;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          max-height: 54px;
          font-size: 14px;
          line-height: 18px;
          margin-bottom: 4px;
          overflow: hidden;
        }
        .expert_container .author {
          font-weight: bold;
          font-size: 12px;
          line-height: 20px;
        }
      `}</style>
    </>
  );
};
export default CryptoExpert;
