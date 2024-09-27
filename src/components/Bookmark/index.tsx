import { FC, useEffect,useState, useCallback } from "react";
import { useStateContext } from "../../store/StateContext";
import {
    initSSOWidget,
    getCookie,
    createPeuuid
} from "../../utils";
import APIS_CONFIG from "../../network/config.json";

interface BookmarkProps {
    msid: string;
    hostId: string;
    type: string;
    widget: string;
}

const Bookmark: FC<BookmarkProps> = ({ msid, hostId, type, widget }) => {
    const { state } = useStateContext();
    const [isBookmarked, setIsBookmarked] = useState(0);
    const { isLogin } = state.login;

    const fetchBookmark = useCallback(async () => {
        const Authorization = getCookie("peuuid") || getCookie("ssoid") || '';
        const url = APIS_CONFIG.getSavedNewsStatus[window.APP_ENV];
      
        // Append query parameters to the URL
        const params = new URLSearchParams({
          prefdataval: msid,
          usersettingsubType: type,
        }).toString();
      
        try {
          const response = await fetch(`${url}?${params}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization,
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          if (data && data.details && data.details.length) {
            setIsBookmarked(1);
          }
        } catch (error) {
          console.error("Error fetching bookmark status:", error);
        }
      }, [msid, type]);
      

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
            const Authorization = getCookie("peuuid") || '';
            const url = APIS_CONFIG.saveNews[window.APP_ENV];
            const channelId = hostId === "364" ? 4 : 0;

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
            <img src={`https://img.etimg.com/photo/${isBookmarked ? '63696446' : '63696304'}.cms`} alt="bookmark icon" />
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
            `}</style>
        </span>
      );
}

export default Bookmark;