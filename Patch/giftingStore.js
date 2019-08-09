/**
 * @class       : NotificationStore
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 23, 2019 12:00:55 IST
 * @description : NotificationStore
 */

import { GiftingActionTypes } from '../actions/GiftingActions';
import { ActionStatus } from '../actions/action';
import { isTruthy } from '../utils';
import { UserActionTypes } from '../actions/UserActions';

const defaultState = {
  giftingData: null,
  giftingDetail: null,
  giftingRetailer: null
};

const store = (state = defaultState, action) => {
    if (action.type === UserActionTypes.REMOVE_USER &&
    action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
    return defaultState;
  }
  if (action.actionStatus !== ActionStatus.COMPLETE_WITH_SUCCESS) {
    return state;
  }

  switch(action.type) {
    case GiftingActionTypes.GET_POINT_GIFT_DATA:
      {
          return Object.assign({}, state, { giftingData: action.payload });
      }
    case GiftingActionTypes.GET_POINT_GIFT_DETAIL:
      {
          return Object.assign({}, state, { giftingDetail: action.payload });
      }
    case GiftingActionTypes.GET_RETAILER_DATA:
        {
            return Object.assign({}, state, { giftingRetailer: action.payload });
        }
      default:
      return state;
  }
  }

  export default store;
