/**
 * @class       : NotificationActions
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 23, 2019 11:51:16 IST
 * @description : NotificationActions
 */

import { PushNotificationIOS, Platform } from 'react-native';
import { startAction, completeActionWithSuccess, completeActionWithError } from './action';
import { fetchNotificationApi, updateNotificationApi } from '../api/notification';

import {NativeModules } from 'react-native';
var SharedPrefModule = NativeModules.RNPushNotification;


export const NotificationActionTypes = {
  FETCH_NOTIFICATION: "FETCH_NOTIFICATION",
  UPDATE_NOTIFICATION: "UPDATE_NOTIFICATION",
  GET_NOTIFICATION_COUNT: "GET_NOTIFICATION_COUNT",
  CLEAR_NOTIFICATION_COUNT: "CLEAR_NOTIFICATION_COUNT",
};

export const fetchNotificationCount = () => {
  return async (dispatch) => {
    try {
             dispatch(completeActionWithSuccess(NotificationActionTypes.GET_NOTIFICATION_COUNT, 0));
	    if (Platform.OS === 'android') {
		    SharedPrefModule.getPref( (err) => {console.log(err)}, 
				    (msg) => {dispatch(completeActionWithSuccess(NotificationActionTypes.GET_NOTIFICATION_COUNT, parseInt(msg)));} );
	    } else {
		    PushNotificationIOS.getApplicationIconBadgeNumber((msg) => {dispatch(completeActionWithSuccess(NotificationActionTypes.GET_NOTIFICATION_COUNT, msg));});
	    }

    } catch (error) {
      dispatch(completeActionWithSuccess(NotificationActionTypes.GET_NOTIFICATION_COUNT, 0));
    }
  }
};

export const clearNotificationCount = () => {
  return async (dispatch) => {
    try {
     if (Platform.OS === 'android') {
      SharedPrefModule.clearPref();
} else {
PushNotificationIOS.setApplicationIconBadgeNumber(0);
}
      dispatch(completeActionWithSuccess(NotificationActionTypes.GET_NOTIFICATION_COUNT, 0));
    } catch (error) {
     dispatch(completeActionWithSuccess(NotificationActionTypes.GET_NOTIFICATION_COUNT, 0));
    }
  }
};

export const fetchNotification = (mobileno) => {
  return async (dispatch) => {
    try {
      dispatch(startAction(NotificationActionTypes.FETCH_NOTIFICATION));
      const response = await fetchNotificationApi(mobileno);
      const notifications = response.Response ? response.Response.NotificationDetails : [];
      dispatch(completeActionWithSuccess(NotificationActionTypes.FETCH_NOTIFICATION, notifications));
    } catch (error) {
      if (error.code === -1031) {
        dispatch(completeActionWithSuccess(NotificationActionTypes.FETCH_NOTIFICATION, []));
      } else {
        dispatch(completeActionWithError(NotificationActionTypes.FETCH_NOTIFICATION, error));
      }
    }
  }
};

export const updateNotification = (mobileno, notificationId, flag) => {
  return async (dispatch) => {
    try {
      dispatch(startAction(NotificationActionTypes.UPDATE_NOTIFICATION));
      const response = await updateNotificationApi(mobileno, notificationId, flag);
      dispatch(fetchNotification(mobileno));
      dispatch(completeActionWithSuccess(NotificationActionTypes.UPDATE_NOTIFICATION));
    } catch (error) {
        dispatch(completeActionWithError(NotificationActionTypes.UPDATE_NOTIFICATION, error));
    }
  }
};
