import HeadingWithRightArrow from '../HeadingWithRightArrow'
import ViewAllCta from '../ViewAllCta'
import styles from './styles.module.scss'

export default function MarketMood() {
  
  return (
    <div>
      <HeadingWithRightArrow title="Market Mood" />
      
      <ViewAllCta title="Stocks" url="/market-mood" />
    </div>
  )
}
