/**
 * @class       : User
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 12:23:58 IST
 * @description : User
 */

import { AsyncStorage } from "react-native"
import { startAction, completeActionWithSuccess, completeActionWithError } from "./action";
import { fetchUserPrivilege } from "./AuthorizationActions";

import { getUserProfile } from '../selectors/UserSelector';
import { clearNotificationCount } from './NotificationActions';

const USER_PROFILE_KEY = '@OrientConnect:USER_PROFILE';

export const UserActionTypes = {
  LOAD_USER: 'LOAD_USER',
  UPDATE_USER: 'UPDATE_USER',
  REMOVE_USER: 'REMOVE_USER',
};

export const loadUser = () => {
  return async function (dispatch, getState) {
    let profile = null;
    profile = getUserProfile(getState());

    if (profile !== null) {
      return;
    }
    try {
      dispatch(startAction(UserActionTypes.LOAD_USER));
      const str = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (str !== null) {
        profile = JSON.parse(str);
        dispatch(completeActionWithSuccess(UserActionTypes.LOAD_USER, profile));
        dispatch(fetchUserPrivilege(profile.RegisteredMobileNo, profile.MemberType));
      } else {
        dispatch(completeActionWithSuccess(UserActionTypes.LOAD_USER, null));
      }
    } catch(error) {
      dispatch(completeActionWithError(UserActionTypes.LOAD_USER, error.message));
    }
  }
}

export const updateUser = (profile) => {
  return async function (dispatch) {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      dispatch(completeActionWithSuccess(UserActionTypes.UPDATE_USER, Object.assign({}, profile)));
    } catch(error) {
      dispatch(completeActionWithError(UserActionTypes.UPDATE_USER, error));
    }
  }
}

export const removeUser = () => {
  return async function (dispatch) {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
      dispatch(completeActionWithSuccess(UserActionTypes.REMOVE_USER));
      clearNotificationCount();
    } catch (error) {
      dispatch(completeActionWithError(UserActionTypes.REMOVE_USER, error));
    }
  }
}
