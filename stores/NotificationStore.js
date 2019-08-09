/**
 * @class       : NotificationStore
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 23, 2019 12:00:55 IST
 * @description : NotificationStore
 */

import { NotificationActionTypes } from '../actions/NotificationActions';
import { ActionStatus } from '../actions/action';
import { isTruthy } from '../utils';
import { UserActionTypes } from '../actions/UserActions';

const defaultState = {
  notifications: [],
  notificationCount: 0,
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
    case NotificationActionTypes.FETCH_NOTIFICATION:
      {
        const notifications = action.payload.map(notification => (
          {
            NotificationContent: notification.NotificationContent,
            NotificationID: notification.NotificationID,
            Responded: isTruthy(notification.Responded),
          })
        );
        return Object.assign({}, state, { notifications });
      }
      case NotificationActionTypes.GET_NOTIFICATION_COUNT:
      {
        return Object.assign({}, state, { notificationCount : action.payload });
      }
    default:
      return state;
  }
}

export default store;
