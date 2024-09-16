import React from 'react'

export default function LessonsFromGrandmasters({ focusArea }) {
  return (
    <>
      <div className={`grandmaster ${focusArea}`}>
        <h2 className="title">Lessons From the Grandmasters</h2>
      </div>
      <style jsx>{`
        .grandmaster{
          padding-left: 20px;          
          margin-top: 1px;
          position: relative;

          &.news {
            border-left: 1px dotted #9b8680;
          }

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
