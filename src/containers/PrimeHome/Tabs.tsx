import React from 'react'

export default function Tabs({ tabs = [], activeTab, setActiveTab, focusArea }: any) {
  return (
    <>
      <div className={`tabs ${focusArea}`}>
      {
        tabs.map((tab, index) => (
          <div key={index} className={`${activeTab === index ? 'activeTab' : ''} tab`} onClick={() => setActiveTab(index)}>
            {tab}
          </div>
        ))
      }
      </div>
      <style jsx>{`
        .tabs {
          display: inline-flex;
          gap: 5px;
          font-size: 10px;
          margin-top: 10px;
          width: 100%;          

          .tab {
            padding: 5px;
            border-radius: 5px;
            cursor: pointer;
          }

          .activeTab {  
            background: #003B65 !important;              
            color: #fff;
            position: relative;
            padding: 5px 7px;
            font-weight: 700;

            &::after {
              content: "";
              display: inline-block;
              margin-left: 5px;
              border-top: 5px solid #003B65;
              border-right: 5px solid transparent;
              border-left: 5px solid transparent;
              position: absolute;
              bottom: -5px;
              left: calc(50% - 5px);
            }
          }

          &.market {
            .tab {
              background: #fff;
            }            
          }          
        }
      `}</style>
    </>
  )
}
