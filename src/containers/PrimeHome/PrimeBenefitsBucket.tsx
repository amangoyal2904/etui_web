import React from 'react'

export default function PrimeBenefitsBucket({focusArea}) {
  const items = [
    {
      title: "Prime Exclusives",
      iconPosition: "-17px -22px",
    }, 
    {
      title: "Investment Ideas",
      iconPosition: "-68px -22px",
    },
    {
      title: "Stock Reports",
      iconPosition: "-118px -22px",
    },
    {
      title: "BigBull Portfolio",
      iconPosition: "-114px -99px",
    },
    {
      title: "ET Grandmasters",
      iconPosition: "-48px -255px",
    },
    {
      title: "Markets Mood",
      iconPosition: "-5px -230px",
    },
    {
      title: "Wealth Magazine",
      iconPosition: "-169px -22px",
    },
    {
      title: "Today's ePaper",
      iconPosition: "-12px -104px",
    },
    {
      title: "Redeem Benefits",
      iconPosition: "-118px -60px",
    }
  ];

  return (
    <>
      <div className={`primeBenefitsBucket ${focusArea}`}>
        <div className="itemWrap">
        {
          items.map((item, index) => (
            <a key={index} className="item">
              <span className="icon" style={{backgroundPosition: item.iconPosition}}></span>
              <span className="title">{item.title}</span>
            </a>
          ))
        }
        </div>
      </div>
      <style jsx>{`
        .primeBenefitsBucket {
          overflow: hidden;
          padding: 15px 0 5px 10px;

          &.news {
            border-left: 1px dotted #9b8680;
          }
          .itemWrap {
            display: inline-flex;
            gap: 10px;
            
            .item {
              background: #fff7f3;
              box-shadow: 0 4px 4px 0 rgba(231,206,206,0.25);
              border: solid 1.5px #f9d8cb;
              border-radius: 5px;
              font-size: 10px;
              font-weight: 700;
              transition: .5s all ease 0;
              position: relative;
              height: 74px;
              width: 85px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              text-align: center;
              padding: 0 7px;

              .icon {
                margin-bottom: 7px;
                background: url(https://img.etimg.com/photo/msid-112277608,quality-100/benefits-icon-sprite.jpg) no-repeat;
                display: inline-block;
                background-size: 210px;
                width: 24px;
                height: 24px;
              }
            }
          }
        }
      `}</style>
    </>
  )
}
