import React from 'react'

export default function Explainers({ data, title }) {
  return (
    <section className="explainers secBox">
      <h2>{title || ""}</h2>
      <ul>
      {
        data?.map((item, index) => <li key={index}>
          <a href={item?.link} target="_blank">
            <img src={item?.img} alt={item?.title} width={256} height={192} title={item?.title} />
            {item?.title || ""}
          </a>
        </li>
        )
      }
      </ul>
    </section>
  )
}
