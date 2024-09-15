import RightArrow from 'components/Icons/RightArrow'
import React from 'react'

export default function HeadingWithRightArrow({ title }) {
  return (
    <>
      <h2>{title} <RightArrow /> </h2>
      <style jsx>{`
        h2 {
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
