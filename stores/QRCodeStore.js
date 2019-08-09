/**
 * @class       : QrCodeStore
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 11, 2019 10:02:09 IST
 * @description : QrCodeStore
 */

import { ActionStatus } from '../actions/action';
import { QRCodeActionsType } from '../actions/QRCodeActions';
import { UserActionTypes } from '../actions/UserActions';

const defaultState = {
  scannedQRCodes: [],
  scannedAndRewardedQRCodes: [],
  QRCodeStatus: null,
  QRCodeDatewiseStatus: null,
  QRCodeTimewiseStatus: null,
  QRCodeStatement: null,
  qrCodePreScanDetails: null,
};

const QRCodeStore = (state = defaultState, action) => {
  if (action.type === UserActionTypes.REMOVE_USER &&
    action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
    return defaultState;
  }
  if (action.actionStatus !== ActionStatus.COMPLETE_WITH_SUCCESS) {
    if (action.actionStatus === ActionStatus.COMPLETE_WITH_ERROR) {
      switch(action.type) {
        case QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS:
          return Object.assign({}, state, { QRCodeStatus: null });
        case QRCodeActionsType.GET_SCANNED_QR_CODE_DATEWISE_STATUS:
          return Object.assign({}, state, { QRCodeDatewiseStatus: null });
        case QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS:
          return Object.assign({}, state, { QRCodeTimewiseStatus: null });
        case QRCodeActionsType.GET_SCANNED_QR_CODE_STATEMENT:
          return Object.assign({}, state, { QRCodeStatement: null });
        case QRCodeActionsType.GET_PRE_SCAN_DETAIL:
          return Object.assign({}, state, { qrCodePreScanDetails: null });        
        default:
          return state;
      }
    }
    return state;
  }
  switch(action.type) {
    case QRCodeActionsType.VALIDATE_N_REWARD_QR_CODE:
      {
        if (!action.payload.Response || !action.payload.Response.QRCodeSubmitDetails) {
          return state;
        }
        const { QRCodeSubmitDetails } = action.payload.Response;
        return Object.assign({}, state, { scannedAndRewardedQRCodes: QRCodeSubmitDetails });
      }

    case QRCodeActionsType.VALIDATE_QR_CODE:
      {
        const { scannedQRCodes } = state;
        if (!action.payload.Response || !action.payload.Response.QRCodeSubmitDetails) {
          return state;
        }
        const { QRCodeSubmitDetails } = action.payload.Response;
        QRCodeSubmitDetails.forEach(detail => {
          if (scannedQRCodes.findIndex(currentQrCode => currentQrCode.BarCode === detail.BarCode) === -1) {
            scannedQRCodes.push(detail);
          }
        });
        return Object.assign({}, state, { scannedQRCodes: Object.assign([], scannedQRCodes) });
      }

    case QRCodeActionsType.REMOVE_QR_CODE:
      {
        const { scannedQRCodes } = state;
        const index = scannedQRCodes.findIndex(currentQrCode => currentQrCode.BarCode === action.payload);
        if (index !== -1) {
          scannedQRCodes.splice(index, 1);
          return Object.assign({}, state, { scannedQRCodes: Object.assign([], scannedQRCodes) });
        }
        return state;
      }

    case QRCodeActionsType.CLEAR_SCANNED_CODES:
      switch (action.payload) {
        case QRCodeActionsType.VALIDATE_N_REWARD_QR_CODE:
          return Object.assign({}, state, { scannedQRCodes: [], scannedAndRewardedQRCodes: [] });
        case QRCodeActionsType.VALIDATE_QR_CODE:
          return Object.assign({}, state, { scannedQRCodes: []});
        case QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS:
          return Object.assign({}, state, { QRCodeStatus: null });
        case QRCodeActionsType.GET_SCANNED_QR_CODE_DATEWISE_STATUS:
          return Object.assign({}, state, { QRCodeDatewiseStatus: null });
        case QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS:
          return Object.assign({}, state, { QRCodeTimewiseStatus: null });
        case QRCodeActionsType.GET_SCANNED_QR_CODE_STATEMENT:
          return Object.assign({}, state, { QRCodeStatement: null });
        default:
          return state;
      }

    case QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS:
        return Object.assign({}, state, { QRCodeStatus: action.payload });

    case QRCodeActionsType.GET_SCANNED_QR_CODE_DATEWISE_STATUS:
        return Object.assign({}, state, { QRCodeDatewiseStatus: action.payload });

    case QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS:
        return Object.assign({}, state, { QRCodeTimewiseStatus: action.payload });

    case QRCodeActionsType.GET_SCANNED_QR_CODE_STATEMENT:
        return Object.assign({}, state, { QRCodeStatement: action.payload });
    case QRCodeActionsType.GET_PRE_SCAN_DETAIL:
        return Object.assign({}, state, { qrCodePreScanDetails: action.payload });
    default:
      return state;
  }
}

export default QRCodeStore;
