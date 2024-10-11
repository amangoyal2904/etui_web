import React, { useEffect } from 'react'
import OneImgTwoColsNewsLayout from './OneImgTwoColsNewsLayout'
import TextImageMiddile from 'components/TextImageMiddile';

export default function Politics({ title, data }) {  
  const politicsNews = data.slice(0,9);
  const politicsInbrif = data.slice(14,19);
  return (
    <>
    <section className="politics" data-ga-impression={`Subscriber Homepage#Politics widget impression#`}>
      <h2><a href="">{title}</a></h2>
      <OneImgTwoColsNewsLayout data={politicsNews} more={{text: "Politics"}}/>
      <div className="second">
        <TextImageMiddile data={politicsInbrif} heading="IN Brief"/>
      </div>
      <div className="third">
        <TwitterWidget/>
      </div>
    </section>
    <style jsx>{`
      .politics {
        padding-bottom: 50px;
        border-top: 1px solid #9b8680;
        margin-bottom: 1px;
        border-bottom: 1px solid #9b8680;

        h2 {
          font-size: 36px;
          padding-top: 35px;
          border-top: 3px solid #9b8680;
          text-transform: uppercase;
          margin-bottom: 20px;
          margin-top: 1px;

          a {
            &::after {
              content: '';
              display: inline-block;
              width: 15px;
              height: 15px;
              top: -4px;
              left: 3px;
              border-top: 2px solid #000;
              border-left: 2px solid #000;
              position: relative;
              cursor: pointer;
              transform: rotate(135deg);
            }
          }
        }

        .first {
          width: 335px;
          margin-right: 20px;
          display: inline-block;

          h3 {
            font-size: 34px;
            font-weight: 600;
            line-height: 1.18;
            margin-top: 6px;
          }
          p {            
            font-size: 14px;
            line-height: 1.43;
            color: #4a4a4a;
            margin-top: 9px;
          }
        }

        .rest {
          width: 335px;
          display: inline-block;
          vertical-align: top;

          a {
            display: block;
            font: 18px 'Faustina', serif;
            padding: 10px 0 16px 0;
            border-bottom: 1px solid #ddc2bb;

            &:hover {
              text-decoration: underline;
            }

            &:first-child {
              padding-top: 0;
            }
          }

          .more {
            a {
              font-size: 12px;
              color: #ed193b;
              font-family: 'Montserrat', sans-serif;
              border: 0;
              text-align: right;
              margin-top: 10px;
            }
          }
        }
        .second{
          width: 255px;
          display: inline-block;
          vertical-align: top;
          margin: 0 20px;
        }
        .third {
          width: 275px;
          display: inline-block;
          vertical-align: top;
        }
      }

    `}</style>
    </>
  )
}
function TwitterWidget(){
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.src = "https://platform.twitter.com/widgets.js";  // URL of the script
      script.async = true;  // Optional: load the script asynchronously
      document.body.appendChild(script);
      //@ts-ignore
      !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []); 
  return (
    <a className="twitter-timeline" data-width="255" data-height="700" data-theme="light" href="https://twitter.com/ETPolitics?ref_src=twsrc%5Etfw">Tweets by ETPolitics</a> 
  )
}