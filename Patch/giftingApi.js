/**
 * @class       : giftingtest
 * @author      : udgeeth
 * @created     : Monday Jan 14, 2019 13:05:24 IST
 * @description : addComplain
 */

import { apiClient } from './api';

export const getPointGiftDataApi = async ({userid, fromdate, todate, schemeid, status}) => {
   const response= await apiClient.post('/GetAllPointGiftingDataAPI', {
    UserId: userid,
    FromDate: fromdate,
    ToDate: todate,
    SchemeId: schemeid,
    Status: status
  });
return response;
};


export const getPointGiftDetailApi = async ({userid, schemeid, status}) => {
   const response= await apiClient.post('/GetPointGiftDetailAPI', {
    UserId: userid,
    SchemeId: schemeid,
    Status: status
  });
return response;
};



export const getUpdateGiftingStatusApi = async ({userid, giftingid, status,remarks}) => {
   const response= await apiClient.post('/UpdateGiftingStatusAPI', {
    UserId: userid,
    GiftingId: giftingid,
    Status: status,
    Remarks: remarks
  });
return response;
};




export const getSEUpdateGiftingStatusApi = async (giftingObject) => {
   const response= await apiClient.post('/SaleExecutiveUpdateGiftingStatusAPI', giftingObject);
return response;
};



export const getRetailerDataApi = async ({userid}) => {
   const response= await apiClient.post('/GetRetailerDataAPI', {
    UserId: userid,
  });
return response;
};


export const retailerRatingApi = async ({userid, schemeid, giftingid,rating,comment}) => {
   const response= await apiClient.post('/RetailerRatingAPI', {
    UserId: userid,
    SchemeId: schemeid,
    GiftingId: giftingid,
    Rating: rating,
    Comment: comment
  });
return response;
};
