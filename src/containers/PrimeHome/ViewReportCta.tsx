import React from 'react'

export default function ViewReportCta({ url }) {
  return (
    <>
      <a href={url} target="_blank" className="viewReport"><span className="pdfIcon"></span> View Report</a>
      <style jsx>{`
        .viewReport {
          position: relative;
          background: #fff6f2;
          font-size: 10px;
          font-weight: 600;
          line-height: 13px;
          color: #000;
          padding: 2px 10px 2px 25px;
          border: 1px solid #000;
          border-radius: 2px;
          
          .pdfIcon{        
            left: 4px;
            top: -4px;
            position: absolute;
            width: 11px;
            height: 12px;
            background: url("https://img.etimg.com/photo/109967743.cms");
            background-size: 500px;
            background-position: -107px -374px;
            zoom: 1.5;
          }
        }
      `}</style>
    </>
  )
}
