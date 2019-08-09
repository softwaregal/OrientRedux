/**
 * @class       : gifting
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 24, 2019 16:16:11 IST
 * @description : gifting
 */

import { apiClient } from './api';
import Toast from 'react-native-simple-toast';

export const getPointGiftDataApi = async ({ userid, fromdate, todate, schemeid, status }) => {
  const response = await apiClient.post('/GetAllPointGiftingDataAPI', {
    UserId: userid,
    FromDate: fromdate,
    ToDate: todate,
    SchemeId: schemeid,
    Status: status
  });
  return response;
};

export const getPointGiftDetailApi = async ({ userid, schemeid, status }) => {
  const response = await apiClient.post('/GetPointGiftDetailAPI', {
    UserId: userid,
    SchemeId: schemeid,
    Status: status
  });
  return response;
};

export const updateGiftingStatusApi = async ({userid, giftingid, status,remarks}) => {
  const response = await apiClient.post('/UpdateGiftingStatusAPI', {
    UserId: userid,
    GiftingId: giftingid,
    Status: status,
    Remarks: remarks
  });
  return response;
};

export const updateReceivedGiftingStatusApi = async ({userid, giftingid, status}) => {
  const response = await apiClient.post('/DispatchedStatusChangedAPI', {
    UserId: userid,
    GiftingId: giftingid,
    Status: status,
  });
  return response;
};

export const seUpdateGiftingStatusApi = async (giftingObject) => {
  const response = await apiClient.post('/SaleExecutiveUpdateGiftingStatusAPI', giftingObject);
  return response;
};

export const fetchRetailerDataApi = async (userid) => {
  const response = await apiClient.post('/GetRetailerDataAPI', {
    UserId: userid,
  });
  return response;
};

export const submitRetailerRatingApi = async ({userid, schemeid, giftingid,rating,comment}) => {
  const response = await apiClient.post('/RetailerRatingAPI', {
    UserId: userid,
    SchemeId: schemeid,
    GiftingId: giftingid,
    Rating: rating,
    Comment: comment
  });
  return response;
};

export const fetchUserMappingApi = async (mobileno) => {
  const response = await apiClient.post('/UserMappingAPI', {
    MobileNo: mobileno
  });
  return response;
};
