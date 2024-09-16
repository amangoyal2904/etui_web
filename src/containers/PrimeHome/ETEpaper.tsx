import React from 'react'

export default function ETEpaper({ focusArea }) {
  return (
    <>
      <div className={`etEPaper ${focusArea}`}>
        <h2 className="title">ET ePaper </h2>
      </div>
      <style jsx>{`
        .etEPaper{
          padding-left: 20px;
          border-left: 1px dotted #9b8680;
          margin-top: 1px;
          position: relative;

          .title {
            border-bottom: 1px solid#9b8680;
            font-size: 20px;
            font-weight: 800;
            padding-bottom: 7px;
            padding-top: 15px;
            text-transform: uppercase;

            &:before {
              content: "";
              left: -7px;
              top: 19px;
              position: absolute;
              width: 16px;
              height: 17px;
              background: url("https://img.etimg.com/photo/109967743.cms");              
              background-size: 500px;
              background-position: -395px -135px;
            }
          }
        }
      `}</style>
    </>
  )
}
