import HeadingWithRightArrow from '../HeadingWithRightArrow'
import ViewAllCta from '../ViewAllCta'
import styles from './styles.module.scss'

export default function MarketMood() {
  
  return (
    <>
      <div>
        <HeadingWithRightArrow title="Market Mood" />
        <table>
          <thead>
            <tr>
              <th></th>
              <th colSpan={5} className="info">No. of Stocks Trading Above</th>            
            </tr>
            <tr>
              <th>Date</th>
              <th>SMA <br/> 20</th>
              <th>SMA <br/> 50</th>
              <th>SMA <br/> 100</th>
              <th>SMA <br/> 200</th>
              <th>EMA <br/> 50</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>02 Feb</td>
              <td>42%</td>
              <td>48%</td>
              <td>52%</td>
              <td>55%</td>
              <td>60%</td>            
            </tr>
            <tr>
              <td>03 Feb</td>
              <td>42%</td>
              <td>48%</td>
              <td>52%</td>
              <td>55%</td>
              <td>60%</td>
            </tr>
            <tr>
              <td>04 Feb</td>
              <td>42%</td>
              <td>48%</td>
              <td>52%</td>
              <td>55%</td>
              <td>60%</td>
            </tr>
            <tr>
              <td>05 Feb</td>
              <td>42%</td>
              <td>48%</td>
              <td>52%</td>
              <td>55%</td>
              <td>60%</td>
            </tr>
          </tbody>
        </table>
        <ViewAllCta title="Stocks" url="/market-mood" />
      </div>
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
          margin-top: 10px;
          border: 2px solid #ccc;

          .info {
            font-family: Montserrat;
            font-size: 9.37px;
            font-weight: 700;
            line-height: 11.42px;
            text-align: center;
            color: #D17D00;
          }

          thead {
            tr:last-child {
              th:not(:first-child) {
                border: 2px solid #ccc;
              }
            }
          }

          tr{
            td:first-child {
              background: #fff;
            }
            th {
              background: #f4f4f4;              
              color: #4D4D4D;
              vertical-align: middle;
              padding: 10px;
              font-family: Montserrat;
              font-size: 11.24px;
              font-weight: 600;
              line-height: 14.99px;
              text-align: center;
            }

            td {
              border: 2px solid #ccc;
              padding: 10px;
              font-family: Montserrat;
              font-size: 13px;
              font-weight: 600;
              line-height: 16px;
              text-align: left;
            }
          }
        }
      `}</style>
    </>
  )
}
