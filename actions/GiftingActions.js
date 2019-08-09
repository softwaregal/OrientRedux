/**
 * @class       : AuthorizationActions
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 18:04:46 IST
 * @description : AuthorizationActions
 */

import {
  getPointGiftDataApi,
  getPointGiftDetailApi,
  updateGiftingStatusApi,
  seUpdateGiftingStatusApi,
  fetchRetailerDataApi,
  submitRetailerRatingApi,
  fetchUserMappingApi,
  updateReceivedGiftingStatusApi,
} from '../api/gifting';

import { startAction, completeActionWithSuccess, completeActionWithError } from './action';
import { showMessage } from './MessageActions';
import { UPDATE_GIFTING_STATUS_VERIFY_HAPPY_CODE, UPDATE_GIFTING_STATUS_SUBMIT_ALL } from '../constants';

export const GiftingActionTypes = {
  GET_POINT_GIFT_DATA: 'GET_POINT_GIFT_DATA',
  GET_POINT_GIFT_DETAIL: 'GET_POINT_GIFT_DETAIL',
  UPDATE_GIFTING_STATUS: 'UPDATE_GIFTING_STATUS',
  UPDATE_RECEIVED_GIFTING_STATUS: 'UPDATE_RECEIVED_GIFTING_STATUS',
  VERIFY_HAPPY_CODE: 'VERIFY_HAPPY_CODE',
  RESET_UPDATE_GIFTING_DATA: 'RESET_UPDATE_GIFTING_DATA',
  SE_UPDATE_GIFTING_STATUS: 'SE_UPDATE_GIFTING_STATUS',
  GET_RETAILER_DATA: 'GET_RETAILER_DATA',
  RETAILER_RATING: 'RETAILER_RATING',
  FETCH_USER_MAPPING: 'FETCH_USER_MAPPING',
  CLEAR_GIFTING_DATA: 'CLEAR_GIFTING_DATA',
}

export const getPointGiftData = ({ userid, fromdate, todate, schemeid, status}) => {
  return async function (dispatch, getState) {

    try {
      dispatch(startAction(GiftingActionTypes.GET_POINT_GIFT_DATA));
      const response = await getPointGiftDataApi({userid, fromdate, todate, schemeid, status });
      const giftingdata = response.Response ? response.Response.PointGiftData : [];
      dispatch(completeActionWithSuccess(GiftingActionTypes.GET_POINT_GIFT_DATA, giftingdata));
    } catch (error) {
      dispatch(clearGiftingData(GiftingActionTypes.GET_POINT_GIFT_DATA));
      dispatch(completeActionWithError(GiftingActionTypes.GET_POINT_GIFT_DATA, error));
    }
  }
}

export const getPointGiftDetail = ({ userid, schemeid, status}) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.GET_POINT_GIFT_DETAIL));
    try {
      const response = await getPointGiftDetailApi({ userid, schemeid, status });
      const giftingdata = response.Response ? response.Response.Detail : [];
      dispatch(completeActionWithSuccess(GiftingActionTypes.GET_POINT_GIFT_DETAIL, giftingdata));
    } catch (error) {
      dispatch(clearGiftingData(GiftingActionTypes.GET_POINT_GIFT_DETAIL));
      dispatch(completeActionWithError(GiftingActionTypes.GET_POINT_GIFT_DETAIL, error));
    }
  }
}


export const updateGiftingStatus = (userid, giftingIds, status, remarks) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.UPDATE_GIFTING_STATUS));
    try {
      const updates = [];
      giftingIds.forEach(id => {
        updates.push(updateGiftingStatusApi({
          userid,
          giftingid: id,
          status,
          remarks
        }));
      });

      await Promise.all(updates);
      dispatch(completeActionWithSuccess(GiftingActionTypes.UPDATE_GIFTING_STATUS));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.UPDATE_GIFTING_STATUS, error));
    }
  }
}

// @Vivek
export const updateReceivedGiftStatus = (userid, giftingIds, status) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.UPDATE_RECEIVED_GIFTING_STATUS));
    try {
      const updates = [];
      giftingIds.forEach(id => {
        updates.push(updateReceivedGiftingStatusApi({
          userid,
          giftingid: id,
          status
        }));
      });

      await Promise.all(updates);
      dispatch(completeActionWithSuccess(GiftingActionTypes.UPDATE_RECEIVED_GIFTING_STATUS));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.UPDATE_RECEIVED_GIFTING_STATUS, error));
    }
  }
}



export const seUpdateGiftingStatus = (giftingObject) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.SE_UPDATE_GIFTING_STATUS));
    try {
      const extraData = {
        Flag: UPDATE_GIFTING_STATUS_SUBMIT_ALL,
      };
      const response = await seUpdateGiftingStatusApi(Object.assign({}, giftingObject, extraData));
      dispatch(completeActionWithSuccess(GiftingActionTypes.SE_UPDATE_GIFTING_STATUS));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.SE_UPDATE_GIFTING_STATUS, error));
    }
  }
}

export const verifyHappyCode = (giftingObject) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.VERIFY_HAPPY_CODE));
    try {
      const extraData = {
        Flag: UPDATE_GIFTING_STATUS_VERIFY_HAPPY_CODE,
      };
      await seUpdateGiftingStatusApi(Object.assign({}, giftingObject, extraData));
      dispatch(completeActionWithSuccess(GiftingActionTypes.VERIFY_HAPPY_CODE, true));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.VERIFY_HAPPY_CODE, error));
    }
  }
}

export const resetUpdateGiftingData = () => {
  return async function (dispatch) {
    dispatch(completeActionWithSuccess(GiftingActionTypes.RESET_UPDATE_GIFTING_DATA));
  }
}

export const fetchRetailerData = (userid) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.GET_RETAILER_DATA));
    try {
      const response = await fetchRetailerDataApi(userid);
      const giftingdata = response.Response ? response.Response.Detail : [];
      dispatch(completeActionWithSuccess(GiftingActionTypes.GET_RETAILER_DATA, giftingdata));
    } catch (error) {
      dispatch(clearGiftingData(GiftingActionTypes.GET_RETAILER_DATA));
      dispatch(completeActionWithError(GiftingActionTypes.GET_RETAILER_DATA, error));
    }
  }
}

export const submitRetailerRating = ({ userid, schemeid, giftingid, rating, comment}) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.RETAILER_RATING));
    try {
      const response = await submitRetailerRatingApi({userid, schemeid, giftingid, rating, comment});
      dispatch(completeActionWithSuccess(GiftingActionTypes.RETAILER_RATING));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(GiftingActionTypes.RETAILER_RATING, error));
    }
  }
}

export const fetchUserMapping = (mobileno) => {
  return async function (dispatch) {
    dispatch(startAction(GiftingActionTypes.FETCH_USER_MAPPING));
    try {
      const response = await fetchUserMappingApi(mobileno);
      dispatch(completeActionWithSuccess(GiftingActionTypes.FETCH_USER_MAPPING, response));
    } catch (error) {
      dispatch(clearGiftingData(GiftingActionTypes.FETCH_USER_MAPPING));
      dispatch(completeActionWithError(GiftingActionTypes.FETCH_USER_MAPPING, error));
    }
  }
}

export const clearGiftingData = (actionType) => {
  return async function (dispatch) {
    try {
      dispatch(completeActionWithSuccess(GiftingActionTypes.CLEAR_GIFTING_DATA, actionType));
    } catch (error) {
    }
  }
}
