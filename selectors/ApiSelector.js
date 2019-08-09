/**
 * @class       : ApiSelector
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 18:53:01 IST
 * @description : ApiSelector
 */

export const isRequestPending = state => state.api.pendingRequestCount > 0;
export const getTaskInProgress = state => state.api.taskInProgress;
export const getUserMessage = state => state.api.userMessage
export const getAction = state => state.api.action;
