import { NextPage } from "next";
import styles from "./styles.module.scss";
interface readMoreProps{
    url:string,
    title:string
}

const ReadMore: NextPage<any> = (props) => {  
    //console.log(props)
    const _readMore = props.readMoreText  ? props.readMoreText : []
    const readMoreHtml = ()=>{
        let _moreNodehtml = []
        if(_readMore){
            _readMore?.map((item:readMoreProps)=>{
               return _moreNodehtml.push(<a key={item.title} href={item.url}>{item.title}</a>)
            })
        }
        return _moreNodehtml;
    }
  return (
    <>   
        {
            _readMore ? <div className={styles.readMoreSec}>
                            <div className={styles.readMoreText}>Read more on</div>
                            <div className={styles.readAnchor}>
                                {readMoreHtml()}
                            </div>
                        </div>: ''
        }  
    </>
  );
};

export default ReadMore;
