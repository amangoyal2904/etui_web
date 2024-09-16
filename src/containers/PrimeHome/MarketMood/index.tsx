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
              <th rowSpan={2}>Date</th>
              <th colSpan={5}>No. of Stocks Trading Above</th>            
            </tr>
            <tr>
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

          th {
            background: #f4f4f4;
            border: 1px solid #f4f4f4;
            color: #4D4D4D;

          }

          td {
            border: 1px solid #f4f4f4;
          }
        }
      `}</style>
    </>
  )
}
