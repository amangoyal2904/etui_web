import React from 'react'

const Opinion = ({OpinionData}) => {
  return (
    <>
        <div className="opinionWidget">
            <h2 className="heading">
                <a href="/opinion" target="_blank">OPINION</a>
            </h2>
            <ul className="opinionWdWrp">
                {
                    OpinionData?.map((value, index) => {
                        return (                        
                            <li className='listWrp' key={index}>
                                <div className="mb10">
                                    <div className="ctgry">ET Commentary</div>
                                    <div className="etPrint">FROM ET PRINT</div>
                                </div>
                                <a target="_blank" className="font_faus listTitle" href={value.url}>{value.title}</a>
                                <p className="line_6 listSyn">{value.synopsis}</p>
                                {
                                    value.authors && <div className="auInfo">
                                        {value.authors[0]?.img && <img className="flt" width="35" height="35" src={value.authors[0]?.img} />}
                                        <span className="auName">{`${!value.authors[0]?.img ? "By" : ""} ${value.authors[0].title}`}</span>
                                    </div>
                                }
                            </li>                        
                        )
                    })
                }
            </ul>
        </div>

        <style jsx>{`
            .mb10 {
                margin-bottom: 10px;
            }
            .opinionWidget{
                padding-top: 1px;
                position: relative;
                border-top: 1px solid #9b8680;
                box-sizing: border-box;
                padding-bottom: 50px;

                .opinionWdWrp{
                    display: flex;
                    justify-content: space-between;
                }

                h2.heading{
                    font-size: 36px;
                    padding-top: 35px;
                    border-top: 3px solid #9b8680;
                    text-transform: uppercase;
                    margin-bottom: 20px;

                    & a:after{
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

                .listWrp{
                    list-style: none;
                    width: 269px;
                    padding: 15px;
                    display: inline-block;
                    vertical-align: top;
                    background-color: #fff9f7;
                    box-shadow: 4px 4px 0 0 #efd9d3;
                    border: solid 1px #ddc2bb;
                    position: relative;

                    .ctgry {
                        color: #930017;
                        text-transform: uppercase;
                        float: left;
                    }

                    .etPrint {
                        color: #fff;
                        font-size: 9px;
                        font-weight: 500;
                        padding: 1px 3px 2px 4px;
                        border-radius: 2px;
                        background-color: #183651;
                        float: right;
                    }

                    .listTitle{
                        font-size: 18px;
                        font-weight: 700;
                        padding: 5px 0;
                        display: block;
                    }

                    .listSyn{
                        font-size: 14px;
                        color: #4a4a4a;
                        line-height: 1.36;
                        margin-bottom: 14px;
                    }

                    .line_6{
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 6;
                        -webkit-box-orient: vertical;
                    }

                    .auName {
                        font-size: 14px;
                        font-weight: 600;
                        margin-left: 47px;
                        display: block;
                    }
                }
            }
        `}</style>
    </>
  )
}

export default Opinion