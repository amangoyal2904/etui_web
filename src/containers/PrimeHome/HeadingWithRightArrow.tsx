import RightArrow from 'components/Icons/RightArrow'
import React from 'react'
import { ET_WEB_URL } from 'utils/common'

export default function HeadingWithRightArrow({ title, href = "" }) {
  return (
    <>
      {href ? <a href={`${href.indexOf("https://") !== -1 ? "" : ET_WEB_URL}${href}`} data-ga-onclick={`Subscriber Homepage#${title} widget click#title - href`} target="_blank" className="title">{title} <RightArrow /> </a> :  <h2 className="title">{title} <RightArrow /> </h2> }
      <style jsx>{`
        .title {
          font-size: 16px;
          font-weight: 600;
          font-family: Montserrat;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </>
  )
}
