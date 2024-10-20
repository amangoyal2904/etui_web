import React, { useEffect, useState } from "react";
import { convertMilliseconds } from "../../utils";
import Loading from "../../components/Loading";
import GLOBAL_CONFIG from "../../network/global_config.json";

const tabListJSON = [
  {
    msid: "4413765",
    name: "Latest Videos"
  },
  {
    msid: "1715249553",
    name: "News",
    mode: "hierarchy"
  },
  {
    msid: "1977021501",
    name: "Markets",
    mode: "hierarchy"
  },
  {
    msid: "4413767",
    name: "Experts",
    mode: "hierarchy"
  },
  {
    msid: "13352306",
    name: "Industry",
    mode: "hierarchy"
  },
  {
    msid: "1052732854",
    name: "Politics",
    mode: "hierarchy"
  },
  {
    msid: "4413774",
    name: "Finance",
    mode: "hierarchy"
  }
];

const VideoWidget = ({ VideoWidgetData, isDev }) => {
  const [videoData, setVideoData] = useState<any>([
    {
      msid: "4413765",
      videoListData: VideoWidgetData
    }
  ]);
  const [showTab, setShowTab] = useState("4413765");
  const [showLoading, setShowLoading] = useState(false);
  const [selectVideo, setSelectVideo] = useState([
    videoData[0]?.videoListData[0]?.msid,
    videoData[0]?.videoListData[0]?.title
  ]);
  const [autoplay, setAutoplay] = useState(0);

  const etDomain = GLOBAL_CONFIG[isDev ? "development" : "production"]["ET_WEB_URL"];

  const videoClick = (vdMsid, title) => {
    setSelectVideo([vdMsid, title]);
  };

  const tabClick = (tabMsid) => {
    setShowTab(tabMsid);
    setAutoplay(0);

    if (!videoData?.some((item) => Number(item.msid) == Number(tabMsid))) {
      const apiLink = `https://etpwaapipre.economictimes.com/request?type=plist&msid=${tabMsid}&contenttype=VIDEO&mode=hierarchy`;
      setShowLoading(true);

      fetch(apiLink)
        .then((response) => response.json())
        .then((res) => {
          console.log("res ---asdasd", res);
          const resData = res?.searchResult[0]?.data;
          setVideoData((prev) => [...prev, { msid: res?.parameters?.msid, videoListData: resData }]);
          setShowLoading(false);

          videoClick(resData[0].msid, resData[0].title);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          console.log("finally");
        });
    } else {
    }
  };

  useEffect(() => {
    if (videoData?.some((item) => Number(item.msid) == Number(showTab))) {
      const selectedObj = videoData?.find((item) => Number(item.msid) == Number(showTab))?.videoListData[0];

      console.log("selectedObj --- ", selectedObj);
      if (selectedObj?.msid) {
        videoClick(selectedObj?.msid, selectedObj?.title);
        setAutoplay(0);

        if (!videoData?.some((item) => Number(item.msid) == Number(showTab))) {
          const apiLink = `https://etpwaapipre.economictimes.com/request?type=plist&msid=${showTab}&contenttype=VIDEO&mode=hierarchy`;
          setShowLoading(true);

          fetch(apiLink)
            .then((response) => response.json())
            .then((res) => {
              const resData = res?.searchResult[0]?.data;
              setVideoData((prev) => [...prev, { msid: res?.parameters?.msid, videoListData: resData }]);
              setShowLoading(false);

              videoClick(resData[0].msid, resData[0].title);
            })
            .catch((error) => {
              console.error("Error:", error);
            })
            .finally(() => {
              console.log("finally");
            });
        } else {
        }
      }
    }
  }, [showTab]);

  return (
    <section className="videoBoxWidget">
      <div className="primvideo">
        <div className="etabsView newsTab">
          <div className="etabsBtn font_mon">
            <div className="heading ">VIDEOS</div>
            <ul className="etab">
              {tabListJSON.map((value, index) => (
                <li
                  key={`videoBoxWidget_key_tab_${index}`}
                  data-msid={value.msid}
                  className={showTab == value.msid ? "active" : ""}
                  onClick={() => tabClick(value.msid)}
                >
                  {value.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="etabsContent">
              <ul>
                {videoData?.some((item) => Number(item.msid) == Number(showTab)) ? (
                  videoData?.map((value: any, index: any) => {
                    return (
                      <li
                        key={`videowidget_etabsContent_key_${index}`}
                        data-msid={value.msid}
                        className={showTab != value.msid ? "hide" : ""}
                      >
                        <div className="vdListWrp">
                          <div className="vplayer">
                            <iframe
                              className="lazyIframe"
                              data-threshold="300"
                              src={`${etDomain}/videodash.cms?autostart=${autoplay}&msid=${selectVideo[0]}&rlvideo=&fallBackMute=true&skipad=1&widget=subsriberhome&iswebpre=true`}
                            />
                            <div className="vtitle">{selectVideo[1]}</div>
                          </div>
                          <div className="vdList">
                            {value?.videoListData.map((listData, index2) => {
                              return (
                                index2 < 8 && (
                                  <div key={`videoListData_key_${index2}`} className="listDiv font_faus">
                                    <div
                                      className="content vid"
                                      onClick={() => {
                                        videoClick(listData?.msid, listData?.title);
                                        setAutoplay(1);
                                      }}
                                      data-msid={listData?.msid}
                                    >
                                      <div className="imgDiv">
                                        <div className={`active leayer ${(autoplay && selectVideo[0] == listData.msid) ? "" : "hide"}`}>
                                          <span>NOW PLAYING</span>
                                        </div>
                                        <span className="imgdiv">
                                          <img
                                            width="155"
                                            height="116"
                                            alt="Trump praises Biden, Harris for calling him"
                                            loading="lazy"
                                            src={listData?.img}
                                          />
                                          <span className="duratio">
                                            {convertMilliseconds(listData?.videoDuration)}
                                          </span>
                                        </span>
                                      </div>
                                      <span className="vdTitle">{listData?.title}</span>
                                    </div>
                                  </div>
                                )
                              );
                            })}
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li>
                    <Loading />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .primvideo {
          background-color: #ffded4;
          width: 100%;
          position: relative;
          padding: 35px 35px 20px;
          border-top: 3px solid #9b8680;
          box-sizing: border-box;

          .hide {
            display: none;
          }

          .etabsBtn {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;

            .heading {
              font-size: 24px;
              font-weight: bold;
            }

            .etab {
              list-style: none;
              display: flex;

              li {
                position: relative;
                margin-right: 10px;
                text-align: center;
                border-bottom: 0;
                letter-spacing: -0.4px;
                line-height: 15px;
                text-decoration: none;
                cursor: pointer;
                vertical-align: top;
                text-transform: capitalize;
                color: #000;
                padding: 5px 24px;
                border-radius: 4px;
                border: solid 1px #9b8680;
                font-size: 15px;
                font-weight: 400;

                &.active {
                  background-color: #183651;
                  font-weight: 600;
                  height: 18px;
                  line-height: 18px;
                  cursor: default;
                  border: solid 1px #efe0e0;
                  color: #fff;
                  font-weight: 500;
                }
              }
            }
          }

          .etabsContent {
            min-height: 450px;
            ul {
              list-style: none;
            }

            .vdListWrp {
              display: flex;

              .vplayer {
                width: 446px;

                iframe {
                  border: 0;
                  height: 335px;
                  width: 100%;
                }

                .vtitle {
                  font-size: 30px;
                  font-weight: 700;
                  line-height: 1.18;
                  margin-top: 6px;
                }
              }

              .vdList {
                width: 743px;
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;

                .listDiv {
                  font-size: 14px;
                  font-weight: 400;
                  width: 155px;
                  margin-top: 15px;
                  cursor: pointer;

                  .content {
                    .vdTitle {
                      font-family: Montserrat;
                      font-size: 14px;
                      line-height: 18px;
                      margin-top: 8px;
                      display: inline-block;
                    }
                    .imgdiv {
                      position: relative;
                      width: 155px;
                      height: 116px;
                      display: inline-block;

                      span.duratio {
                        position: absolute;
                        bottom: 2px;
                        left: 2px;
                        color: #fff;
                        font-size: 10px;
                        background: #ed193b;
                        line-height: 12px;
                        padding: 2px;
                        z-index: 10;
                        font-family: "Montserrat";
                        font-weight: 600;
                      }

                      img {
                        float: left;
                        margin-right: 10px;
                      }
                    }

                    .active {
                      opacity: 0.7;
                      background-color: #000;
                      z-index: 10;
                      width: 155px;
                      height: 116px;
                      position: absolute;
                      color: #fff;

                      span {
                        padding: 4px 10px 5px 10px;
                        border-radius: 12.5px;
                        border: solid 1px #fff;
                        position: absolute;
                        top: 36%;
                        z-index: 100;
                        left: 24px;
                        background: #000;
                        font-family: Montserrat;
                        font-size: 11px;
                        font-weight: 600;
                        color: #fff;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `}</style>
    </section>
  );
};

export default VideoWidget;
