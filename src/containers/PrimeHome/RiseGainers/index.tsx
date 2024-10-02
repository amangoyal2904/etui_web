
import styles from './styles.module.scss'
export default function MarketGainers() {
  
    return (
      <>
      <div className="gainer_loser">
            <h2 className="head">
                <span className="h_name">Gainers</span>
                <div className="btn_wrp">
                    <span className="ar_btn gl_prev"></span>
                    <span className="ar_btn gl_next"></span>
                </div>
            </h2>
            {/* <include-html>/defaultp_gainer_loser.cms?exchange=nse&amp;tn=default_prime</include-html> */}
        </div>
      </>
    )
}
//export default MarketGainers;