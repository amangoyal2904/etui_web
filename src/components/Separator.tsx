import React from 'react'

export default function Separator({ height = 1 }) {
  return (
    <>
      <div></div>
      <style jsx>{`
        div {
          height: ${height}px;
          background-color: #898989;
          margin: 15px 0;
        }
      `}</style>
    </>
  )
}
