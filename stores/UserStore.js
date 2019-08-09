/**
 * @class       : UserStore
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 13:36:21 IST
 * @description : UserStore
 */

import { UserActionTypes } from '../actions/UserActions';
import { AuthorizationActionTypes } from '../actions/AuthorizationActions';
import { ActionStatus } from '../actions/action';
import { isTruthy } from '../utils';

const defaultState = {
  isLoading: false,
  me: null,
  privilegeMap: null,
  profileDetail: null,
};

const UserStore = (state = defaultState, action) => {
  let newState = null;
  switch(action.type) {
    case UserActionTypes.LOAD_USER:
      if (action.actionStatus === ActionStatus.IN_PROGRESS) {
        return Object.assign({}, state, { me: null, isLoading: true });
      } else {
        newState = Object.assign({}, state, { isLoading: false });
        if (action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
          newState.me = action.payload;
        } else {
          newState.me = null;
        }
        return newState;
      }
    case UserActionTypes.UPDATE_USER:
      newState = Object.assign({}, state, { isLoading: false });
      if (action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
        newState.me = action.payload;
      }
      return newState;
    case UserActionTypes.REMOVE_USER:
      if (action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
      return defaultState;
      }
      return Object.assign({}, state, { isLoading: false });

    case AuthorizationActionTypes.FETCH_USER_PRIVILEDGE:
      if (action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
        const privilegeMap = {};
        action.payload.reduce((obj, entry) => {
          obj[entry.ModuleName]= isTruthy(entry.Privilege);
          return obj;
        }, privilegeMap);
        return Object.assign({}, state, { privilegeMap });
      }
      return state;
    case AuthorizationActionTypes.FETCH_PROFILE_DETAIL:
      if (action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
        const profileDetail = action.payload;
        if (!profileDetail.BUName) {
          profileDetail.BUName = profileDetail.BUId;
        }
        if (!profileDetail.FirmState) {
          profileDetail.FirmState = profileDetail.FirmStateName;
        }
        if (!profileDetail.FirmCity) {
          profileDetail.FirmCity = profileDetail.FirmCityName;
        }
        if (!profileDetail.PersonalAddressState) {
          profileDetail.PersonalAddressState = profileDetail.PersonalStateName;
        }
        return Object.assign({}, state, { profileDetail: profileDetail });
      }
      return state;
    default:
      return state;
  }
};

export default UserStore;
