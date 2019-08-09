/**
 * @class       : Action
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 12:52:47 IST
 * @description : Action
 */

export const ActionStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE_WITH_SUCCESS: 'COMPLETE_WITH_SUCCESS',
  COMPLETE_WITH_ERROR: 'COMPLETE_WITH_ERROR',
}

export const startAction = (type, message) => {
  return { type, message, actionStatus: ActionStatus.IN_PROGRESS };
}

export const completeActionWithSuccess = (type, payload) => {
  return { type, payload, actionStatus: ActionStatus.COMPLETE_WITH_SUCCESS };
}

export const completeActionWithError = (type, error) => {
  return { type, error, actionStatus: ActionStatus.COMPLETE_WITH_ERROR };
}

