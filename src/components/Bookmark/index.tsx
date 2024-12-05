import { FC, useEffect,useState, useCallback } from "react";
import { useStateContext } from "../../store/StateContext";
import {
    initSSOWidget,
    getCookie,
    createPeuuid
} from "../../utils";
import APIS_CONFIG from "../../network/config.json";
import { trackingEvent } from "utils/ga";

interface BookmarkProps {
    msid: string;
    hostId: string;
    type: string;
    widget?: string;
    apiType?: string;
}

const Bookmark: FC<BookmarkProps> = ({ msid, hostId, type, widget, apiType }) => {
    const { state } = useStateContext();
    const [isBookmarked, setIsBookmarked] = useState(0);
    const { isLogin } = state.login;

    const fetchBookmark = useCallback(async () => {
        if (typeof window.bookmarkApiHitStatus === 'undefined' || window.bookmarkApiHitStatus === 'failed') {
            window.bookmarkApiHitStatus = 'hit';
            const Authorization = getCookie("peuuid") || getCookie("ssoid") || '';
            const url = APIS_CONFIG.getSavedNewsStatus[window.APP_ENV];
        
            // Append query parameters to the URL
            const params = new URLSearchParams(
                apiType === 'single'
                    ? { prefdataval: msid, usersettingsubType: type }
                    : { stype: '0', pagesize: '100', pageno: '1' }
            ).toString();
        
            try {
                const response = await fetch(`${url}?${params}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization,
                    },
                });
        
                if (!response.ok) {
                    window.bookmarkApiHitStatus = 'failed';
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                window.bookmarkApiHitStatus = 'success';
        
                const data = await response.json();
                window.bookmarkApiRes = [];
                
                if (apiType === 'single' && data && data.details && data.details.length) {
                    const bookmarkListArr = data.details.map((entry: any) => ({
                        msid: entry.msid,
                      })).filter(Boolean);
                    window.bookmarkApiRes = bookmarkListArr || [];
                    setIsBookmarked(1);
                } else if (apiType === 'all' && data && data.details && data.details.length) {
                    const bookmarkListArr = data.details.map((entry: any) => ({
                        msid: entry.msid,
                      })).filter(Boolean);
                    window.bookmarkApiRes = bookmarkListArr || [];
                    const bookmarkStatusForAll = new Event("bookmarkStatusForAll");
                    document.dispatchEvent(bookmarkStatusForAll);
                }
            } catch (error) {
                window.bookmarkApiHitStatus = 'failed';
                console.error("Error fetching bookmark status:", error);
            }
        }else if(window.bookmarkApiHitStatus === 'success' && window.bookmarkApiRes.length > 0){
            const bookmarkStatusForAll = new Event("bookmarkStatusForAll");
            document.dispatchEvent(bookmarkStatusForAll);    
        }
    }, [msid, type, apiType, setIsBookmarked]);

    const checkBookmarkStatus = useCallback(() => {
        const apiRes = window.bookmarkApiRes || [];
        const checkStatus = apiRes.some(item => item.msid == msid);

        if (checkStatus) setIsBookmarked(1);
    }, [msid, setIsBookmarked]);

    useEffect(() => {
        document.addEventListener("bookmarkStatusForAll", checkBookmarkStatus);
        fetchBookmark();

        return () => {
            document.removeEventListener("bookmarkStatusForAll", checkBookmarkStatus);
        };
    }, [fetchBookmark, checkBookmarkStatus]); 

    // use effect to fetch and check bookmark status
    useEffect(() => {
        if(isLogin) {
            const Authorization = getCookie("peuuid");
            if(!Authorization) {
                createPeuuid(fetchBookmark)
            } else {
                fetchBookmark()
            }
        }
    },[isLogin, msid, fetchBookmark])

    const saveBookmark = async () => {
        console.log('saveBookmark', msid,type,isLogin);
        if(isLogin){
            console.log('saveBookmark isLogin');
            trackingEvent("et_push_event", {
                event_category: 'UB - Save Article', 
                event_action: `Save Article - ${msid}`, 
                event_label: window.location.href
              });
            const Authorization = getCookie("peuuid") || '';
            const url = APIS_CONFIG.saveNews[window.APP_ENV];
            const channelId = hostId === "364" ? 4 : hostId === "318" ? 1 : 0;
            const action = isBookmarked === 1 ? 0 : 1

            try{
                const response = await fetch(`${url}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        source: 0,
                        userSettings: [
                            {
                            stype: 0,
                            msid,
                            articletype: type,
                            action: isBookmarked === 1 ? 0 : 1,
                            channelId
                            }
                        ]
                    })
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.length && data[0]?.status === "success") {
                    window.bookmarkApiRes =
                        action === 1
                            ? [
                                ...window.bookmarkApiRes,
                                {
                                msid: msid
                            },
                            ]
                            : window.bookmarkApiRes.filter(
                                (item: any) =>
                                item.msid != msid
                            );
                    setIsBookmarked((prev) => (prev === 1 ? 0 : 1));
                }
            } catch(e){
                console.log('error in saving', e)
            }
        } else {
            initSSOWidget();
        }
    }
    return (
        <span className={`${widget == 'mostread_primehome' ? 'mostread_bookmark' : 'bookmark'}  ${isBookmarked ? 'saved' : ''}`} onClick={saveBookmark}>
            {
                apiType == "all" ? <span className={`cSprite bookmark-icon ${isBookmarked ? 'saved' : ''}`}></span> :
                <img src={`https://img.etimg.com/photo/${isBookmarked ? '63696446' : '63696304'}.cms`} alt="bookmark icon" loading="lazy"  />
            }
            <style jsx>{`
                .bookmark {
                    position: relative;
                    left: 112px;
                    cursor: pointer;
                    padding: 2px;
                    border: 1px solid;
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    margin-right: 20px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 10px;
                }

                .mostread_bookmark{
                    position: relative; 
                    width: 22px;
                    height: 22px;
                    display: inline-flex;
                    align-items: flex-start;
                    justify-content: center;
                    cursor: pointer;
                }

                .cSprite {
                    background: url('https://img.etimg.com/photo/msid-98203283,quality-100/subscriber-sprite.jpg') no-repeat;
                    display: inline-block;
                    background-size: 475px;

                    &.bookmark-icon {
                        width: 9px;
                        height: 15px;
                        background-position: -79px -6px;

                        &.saved {
                            background-position: -91px -6px;
                        }
                    }
                }
            `}</style>
        </span>
      );
}

export default Bookmark;