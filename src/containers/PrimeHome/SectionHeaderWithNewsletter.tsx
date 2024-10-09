import { ET_WEB_URL } from 'utils/common'
import NewsLetter from './NewsLetter'

export default function SectionHeaderWithNewsletter({ url, title }) {
  return (
    <>
      <div className="sectionHeader">
        <h2><a href={`${ET_WEB_URL}${url}`}>{title}</a></h2>
        <NewsLetter section={title}/>
      </div>
      <style jsx>{`
        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;                
          border-top: 3px solid #9b8680;
          margin-bottom: 20px;
          padding-top: 35px;   

          h2 {
            font-size: 36px;                     
            text-transform: uppercase;
            
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
        }        
      `}</style>
    </>
  )
}
