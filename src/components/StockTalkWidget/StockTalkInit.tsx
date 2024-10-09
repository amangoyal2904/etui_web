import React, { useEffect } from 'react';

import { scriptInit } from 'utils/SlikeConfig';

const StockTalk = (props) => {
  useEffect(() => {
    if(props?.data?.eventId) {
      scriptInit({
        eventStatus: props?.data?.eventStatus,
        eventToken: props?.data?.eventToken,
        eventId: props?.data?.eventId,
      });
    }
  }, [props]);

  return (
    <div id="liveStrmStockTalk">
      <div className="jsPlayStream_st"></div>
      <div 
        data-primeevent={props?.data?.primeEvent} 
        data-paidevent={props?.data?.paidEvent} 
        data-expertid={props?.data?.expertId} 
        data-id={props?.data?.eventId} 
        className="jsPlayStream_st"
      >
	        <div className="athena__video prel">
              <div className="athena_stream" style={{backgroundImage: `url(${props?.data?.eventImageUrl})`}}></div>
            </div>
      </div>
    </div>
  );
};

export default StockTalk;
