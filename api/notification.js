/**
 * @class       : notification
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 23, 2019 11:42:32 IST
 * @description : notification
 */

import { apiClient } from './api';

const mockData = require('./mockData.json');

export const fetchNotificationApi = async (mobileno) => {
  return await apiClient.post('/GetNotification', {
    MobileNo: mobileno
  });
};

export const updateNotificationApi = async (mobileno, notificationId, flag) => {
  return await apiClient.post('/UpdateNotificationResponse', {
    MobileNo: mobileno,
    NotificationId: notificationId,
    Flag: flag
  });
};
