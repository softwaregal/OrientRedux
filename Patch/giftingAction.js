/**
 * @class       : AuthorizationActions
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 18:04:46 IST
 * @description : AuthorizationActions
 */

import {
  getPointGiftDataApi,
  getPointGiftDetailApi,
  getUpdateGiftingStatusApi,
  getSEUpdateGiftingStatusApi,
  getRetailerDataApi,
  retailerRatingApi
} from '../api/gifting';

import { updateUser, removeUser } from './UserActions';
import { startAction, completeActionWithSuccess, completeActionWithError } from './action';
import { showMessage } from './MessageActions';
import { getUserProfile } from '../selectors/UserSelector';
import { getGiftingList } from '../selectors/GiftingSelector';

export const GiftingActionTypes = {
  GET_POINT_GIFT_DATA: 'GET_POINT_GIFT_DATA',
  GET_POINT_GIFT_DETAIL: 'GET_POINT_GIFT_DETAIL',
  GET_UPDATE_GIFTING_STATUS: 'GET_UPDATE_GIFTING_STATUS',
  GET_SE_UPDATE_GIFTING_STATUS: 'GET_SE_UPDATE_GIFTING_STATUS',
  GET_RETAILER_DATA: 'GET_RETAILER_DATA',
  RETAILER_RATING: 'RETAILER_RATING'
}

export const getPointGiftData = ({ userid, fromdate, todate, schemeid, status}) => {
  return async function (dispatch, getState) {
      const list = getGiftingList(getState());

      if (list && list.length > 0) {
        return;
      }
        try {
          dispatch(startAction(GiftingActionTypes.GET_POINT_GIFT_DATA));
          const response = await getPointGiftDataApi({userid, fromdate, todate, schemeid, status });
          const giftingdata = response.Response ? response.Response.PointGiftData : [];
          dispatch(completeActionWithSuccess(GiftingActionTypes.GET_POINT_GIFT_DATA, giftingdata));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.GET_POINT_GIFT_DATA, error));
    }
  }
}

export const getPointGiftDetail = ({ userid, schemeid, status}) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.GET_POINT_GIFT_DETAIL));
    try {
      const response = await getPointGiftDetailApi({userid, schemeid, status });
      const giftingdata = response.Response ? response.Response.Detail : [];
      dispatch(completeActionWithSuccess(GiftingActionTypes.GET_POINT_GIFT_DETAIL, giftingdata));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.GET_POINT_GIFT_DETAIL, error));
    }
  }
}


export const getUpdateGiftingStatus = ({ userid, giftingid, status,remarks}) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.GET_UPDATE_GIFTING_STATUS));
    try {
      await getUpdateGiftingStatusApi({userid, giftingid, status,remarks});
      dispatch(completeActionWithSuccess(GiftingActionTypes.GET_UPDATE_GIFTING_STATUS));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.GET_UPDATE_GIFTING_STATUS, error));
    }
  }
}


export const getSEUpdateGiftingStatus = (giftingObject) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.GET_UPDATE_GIFTING_STATUS));
    try {
      await getSEUpdateGiftingStatusApi(giftingObject);
      dispatch(completeActionWithSuccess(GiftingActionTypes.GET_SE_UPDATE_GIFTING_STATUS));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.GET_UPDATE_GIFTING_STATUS, error));
    }
  }
}



export const getRetailerData = ({ userid }) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.GET_RETAILER_DATA));
    try {
      const response = await getRetailerDataApi({userid});
      const giftingdata = response.Response ? response.Response.Detail : [];
      dispatch(completeActionWithSuccess(GiftingActionTypes.GET_RETAILER_DATA, giftingdata));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.GET_RETAILER_DATA, error));
    }
  }
}


export const retailerRating = ({ userid, schemeid, giftingid, rating, comment}) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.RETAILER_RATING));
    try {
      await retailerRatingApi({userid, schemeid, giftingid, rating, comment});
      dispatch(completeActionWithSuccess(GiftingActionTypes.RETAILER_RATING));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.RETAILER_RATING, error));
    }
  }
}
