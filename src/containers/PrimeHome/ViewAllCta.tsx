import React from 'react'

export default function ViewAllCta({ title, url }: { title: string, url: string }) {
  return (
    <>
      <a href={url}>View All {title}</a>
      <style jsx>{`
        a {
          display: block;
          border-radius: 4px;
          border: 1px solid #000;  
          text-align: center;
          width: 80%;
          margin: 0 auto;
          padding: 5px;
        }
      `}</style>
    </>
  )
}
