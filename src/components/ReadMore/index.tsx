import { NextPage } from "next";
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
            _readMore.map((item:readMoreProps)=>{
               return _moreNodehtml.push(<a key={item.title} href={item.url} rel="noreferrer" target="_blank">{item.title}</a>)
            })
        }
        return _moreNodehtml;
    }
  return (
    <>   
        {
            _readMore ? <div className="readMoreSec">
                            <div className="readMoreText">Read more on</div>
                            <div className="readanchore">
                                {readMoreHtml()}
                            </div>
                        </div>: ''
        }  
    </>
  );
};

export default ReadMore;
