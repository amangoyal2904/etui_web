import APIS_CONFIG from "../../../network/config.json";



const fetchViewTable = async (
    bodyParams: any,
    isprimeuser: any,
    ssoid: any,
    apiType: any,
    APP_ENV: any
  ) => {
    const apiUrl = (APIS_CONFIG as any)?.[apiType][APP_ENV];
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ssoid: ssoid,
          isprime: isprimeuser,
        },
        cache: "no-store",
        body: JSON.stringify({ ...bodyParams }),
      });
    const resJson = response?.json();
    return resJson;
  };

  export const getCustomViewTable = async (
    bodyParams: any,
    isprimeuser: boolean,
    ssoid: any,
    apiType: string,
    APP_ENV: any
  ) => {
    const responseData = await fetchViewTable(
      bodyParams,
      isprimeuser,
      ssoid,
      apiType,
      APP_ENV
    );
    let unixDateTime = "";
    let pageSummary = null;
    let tableData = [];
    let tableHeaderData = [];
    //console.log('____resresponseDataponse', {bodyParams})
  
    if (responseData?.unixDateTime) {
      unixDateTime = responseData.unixDateTime;
    }
  
    if (responseData?.pageSummary) {
      pageSummary = responseData.pageSummary;
    }
  
    if (responseData?.dataList) {
      const tableData = responseData.dataList;
      if (tableData.length > 0 && tableData[0]?.data) {
        tableHeaderData = tableData[0].data;
      }
    } else {
      const tableData = responseData;
      if (tableData?.length > 0 && tableData[0]?.data) {
        tableHeaderData = tableData[0].data;
      }
    }
    let screenerDetail: any = {};
    if (responseData && responseData.screenerDetail) {
      screenerDetail = { ...responseData.screenerDetail };
    }
    const _queryCondition = screenerDetail?.displayQuery;
    return {
      tableHeaderData,
      tableData,
      pageSummary,
      unixDateTime,
      payload: { ...bodyParams, queryCondition: _queryCondition },
      screenerDetail,
    };
  };  