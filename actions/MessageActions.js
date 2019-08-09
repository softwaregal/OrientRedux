/**
 * @class       : MessageActions
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 14, 2019 17:00:38 IST
 * @description : MessageActions
 */

export const MessageType = {
  SHOW_INFO_MESSAGE: 'SHOW_INFO_MESSAGE',
  SHOW_ERROR_MESSAGE: 'SHOW_ERROR_MESSAGE',
  SHOW_WARNING_MESSAGE: 'SHOW_WARNING_MESSAGE',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
}

export const showMessage = (message, title = 'Info') => {
  return { type: MessageType.SHOW_INFO_MESSAGE, payload: { message, title }};
}

export const showErrorMessage = (message, title = 'Error') => {
  return { type: MessageType.SHOW_ERROR_MESSAGE, payload: { message, title }};
}

export const showWarningMessage = (message, title = 'Warning') => {
  return { type: MessageType.SHOW_WARNING_MESSAGE, payload: { message, title }};
}

export const clearUserMessage = () => {
  return { type: MessageType.CLEAR_MESSAGE };
}
