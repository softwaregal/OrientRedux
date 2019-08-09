/**
 * @class       : helpStore
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 09, 2019 14:36:27 IST
 * @description : helpStore
 */

import {Platform} from 'react-native';

import { HelpActionTypes } from '../actions/helpActions';
import { ActionStatus } from '../actions/action';
import { UserActionTypes } from '../actions/UserActions';

const defaultState = {
  contactUs: null,
  aboutUs: null,
  appversion: null,
};

const help = (state = defaultState, action) => {
  if (action.type === UserActionTypes.REMOVE_USER &&
    action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
    return defaultState;
  }
  if (action.actionStatus !== ActionStatus.COMPLETE_WITH_SUCCESS) {
    return state;
  }
  switch (action.type) {
    case HelpActionTypes.FETCH_CONTACT_US:
    console.log("Action payload is : " + JSON.stringify(action.payload));
      return Object.assign({}, state, { contactUs: action.payload });
    case HelpActionTypes.FETCH_ABOUT_US:
      return Object.assign({}, state, { aboutUs: action.payload });
    case HelpActionTypes.FETCH_APP_VERSION:
      return Object.assign({}, state, {
        appversion: Platform.select({ android: action.payload.AppVersionAndroid, ios: action.payload.AppVersionIOS })
      });
    case HelpActionTypes.RESET_APP_VERSION:
      return Object.assign({}, state, {
        appversion: null
      });
    default:
      return state;
  }
  return state;
};

export default help;
