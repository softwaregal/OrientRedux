/**
 * @class       : GiftingStore
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 25, 2019 11:54:14 IST
 * @description : GiftingStore
 */

import { GiftingActionTypes } from '../actions/GiftingActions';
import { ActionStatus } from '../actions/action';
import { isTruthy } from '../utils';
import { UserActionTypes } from '../actions/UserActions';

const defaultState = {
  schemes:null,
  giftingDetails: null,
  retailerGiftingDetails: [],
  happyCodeApproved: null,
  updateGiftStatus: null,
  userMapping: null,
};

const store = (state = defaultState, action) => {
  if (action.type === UserActionTypes.REMOVE_USER &&
    action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
    return defaultState;
  }
  if (action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
    switch(action.type) {
      case GiftingActionTypes.GET_POINT_GIFT_DATA:
        return Object.assign({}, state, { schemes: action.payload });
      case GiftingActionTypes.GET_POINT_GIFT_DETAIL:
        return Object.assign({}, state, { giftingDetails: action.payload });
      case GiftingActionTypes.GET_RETAILER_DATA:
        return Object.assign({}, state, { retailerGiftingDetails: action.payload });
      case GiftingActionTypes.VERIFY_HAPPY_CODE:
        return Object.assign({}, state, { happyCodeApproved: true });
      case GiftingActionTypes.RESET_UPDATE_GIFTING_DATA:
        return Object.assign({}, state, { happyCodeApproved: null, updateGiftStatus: null });
      case GiftingActionTypes.SE_UPDATE_GIFTING_STATUS:
        return Object.assign({}, state, { updateGiftStatus: true });
      case GiftingActionTypes.FETCH_USER_MAPPING:
        return Object.assign({}, state, { userMapping: action.payload });
      case GiftingActionTypes.CLEAR_GIFTING_DATA:
        switch(action.payload) {
          case GiftingActionTypes.GET_POINT_GIFT_DATA:
            return Object.assign({}, state, { schemes: null });
          case GiftingActionTypes.GET_POINT_GIFT_DETAIL:
            return Object.assign({}, state, { giftingDetails: null });
          case GiftingActionTypes.GET_RETAILER_DATA:
            return Object.assign({}, state, { retailerGiftingDetails: [] });
          case GiftingActionTypes.FETCH_USER_MAPPING:
            return Object.assign({}, state, { userMapping: null });
          default:
            return state;
        }
      default:
        return state;
    }
  }
   if (action.actionStatus === ActionStatus.COMPLETE_WITH_ERROR) {
    switch(action.type) {
      case GiftingActionTypes.GET_POINT_GIFT_DETAIL:
        return Object.assign({}, state, { giftingDetails: [] });
        case GiftingActionTypes.GET_POINT_GIFT_DATA:
            return Object.assign({}, state, { schemes: [] });
      default:
        return state;
    }
  }
  if (action.type === GiftingActionTypes.VERIFY_HAPPY_CODE) {
    if (action.actionStatus === ActionStatus.IN_PROGRESS) {
      return Object.assign({}, state, { happyCodeApproved: null });
    } else if (action.actionStatus === ActionStatus.COMPLETE_WITH_ERROR) {
      return Object.assign({}, state, { happyCodeApproved: false });
    }
  }

  return state;
}

export default store;
