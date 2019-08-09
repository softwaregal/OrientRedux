/**
 * @class       : QRCodeActions
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 10, 2019 19:01:25 IST
 * @description : QRCodeActions
 */

import { startAction, completeActionWithSuccess, completeActionWithError } from "./action"
import {
  validateQrCodeApi,
  fetchQRCodeStatusApi,
  fetchQRCodeDatewiseStatusApi,
  fetchQRCodeTimewiseStatusApi,
  fetchQRCodeStatementApi,
  fetchRetailerPreScanDetailApi
} from '../api/qrcode';

export const QRCodeActionsType = {
  VALIDATE_QR_CODE: 'VALIDATE_QR_CODE',
  VALIDATE_N_REWARD_QR_CODE: 'VALIDATE_N_REWARD_QR_CODE',
  REMOVE_QR_CODE: 'REMOVE_QR_CODE',
  CLEAR_SCANNED_CODES: 'CLEAR_SCANNED_CODES',
  GET_SCANNED_QR_CODE_STATUS: 'GET_SCANNED_QR_CODE_STATUS',
  GET_SCANNED_QR_CODE_DATEWISE_STATUS: 'GET_SCANNED_QR_CODE_DATEWISE_STATUS',
  GET_SCANNED_QR_CODE_TIMEWISE_STATUS: 'GET_SCANNED_QR_CODE_TIMEWISE_STATUS',
  GET_SCANNED_QR_CODE_STATEMENT: 'GET_SCANNED_QR_CODE_STATEMENT',
  GET_PRE_SCAN_DETAIL: 'GET_PRE_SCAN_DETAIL',
};


export const validateQrCode = (mobileno, qrcode, reward = false) => {
  return async function(dispatch) {
    let actionType = QRCodeActionsType.VALIDATE_QR_CODE;
    if (reward) {
      actionType = QRCodeActionsType.VALIDATE_N_REWARD_QR_CODE;
    }
    try {
      dispatch(startAction(actionType, !reward ? 'Validating QR code...' : 'Submitting QR code...'));
      if (!qrcode || qrcode.length === 0) {
        dispatch(completeActionWithError(actionType, 'QR Code is empty'));
        return;
      }
      const response = await validateQrCodeApi(mobileno, qrcode, reward);
      dispatch(completeActionWithSuccess(actionType, response));
    } catch (error) {
      dispatch(completeActionWithError(actionType, error));
    }
  }
}

export const removeQRCode = (qrcode) => {
  return async function(dispatch) {
    try {
      dispatch(startAction(QRCodeActionsType.REMOVE_QR_CODE));
      dispatch(completeActionWithSuccess(QRCodeActionsType.REMOVE_QR_CODE, qrcode));
    } catch (error) {
      dispatch(completeActionWithError(QRCodeActionsType.REMOVE_QR_CODE, error));
    }
  }
}

export const clearScannedQRCode = (actionType) => {
  return async function(dispatch) {
      dispatch(startAction(QRCodeActionsType.CLEAR_SCANNED_CODES));
      dispatch(completeActionWithSuccess(QRCodeActionsType.CLEAR_SCANNED_CODES, actionType));
  }
}

export const fetchQRCodeStatus = (mobileno, fromDate, toDate, BUName) => {
  return async function(dispatch) {
    try {
      dispatch(startAction(QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS));

      const response = await fetchQRCodeStatusApi(mobileno, fromDate, toDate);

      if (response && response.Response && response.Response.ScannedQRCodeDetails) {
        let details = response.Response.ScannedQRCodeDetails;
        if (BUName) {
          details = details.filter(d => d.BUName === BUName);
        }
        dispatch(completeActionWithSuccess(
          QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS,
          details
        ));
      } else {
        dispatch(completeActionWithSuccess(QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS, []));
      }
    } catch (error) {
      dispatch(completeActionWithError(QRCodeActionsType.GET_SCANNED_QR_CODE_STATUS, error));
    }
  }
}

export const fetchQRCodeDatewiseStatus = (mobileno, fromDate) => {
  return async function(dispatch) {
    try {
      dispatch(startAction(QRCodeActionsType.GET_SCANNED_QR_CODE_DATEWISE_STATUS));

      const response = await fetchQRCodeDatewiseStatusApi(mobileno, fromDate);
      console.log("Date wise is : ", response);
      if (response && response.Response && response.Response.QRCodeDateWiseDetails) {
        dispatch(completeActionWithSuccess(
          QRCodeActionsType.GET_SCANNED_QR_CODE_DATEWISE_STATUS,
          response.Response.QRCodeDateWiseDetails
        ));
      } else {
        dispatch(completeActionWithSuccess(QRCodeActionsType.GET_SCANNED_QR_CODE_DATEWISE_STATUS, []));
      }
    } catch (error) {
      dispatch(completeActionWithError(QRCodeActionsType.GET_SCANNED_QR_CODE_DATEWISE_STATUS, error));
    }
  }
}

export const fetchQRCodeTimewiseStatus = (mobileno, fromDate) => {
  return async function(dispatch) {
    try {
      dispatch(startAction(QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS));

      const response = await fetchQRCodeTimewiseStatusApi(mobileno, fromDate);

      if (response && response.Response && response.Response.QRCodeTimeWiseDetailDetails) {
        dispatch(completeActionWithSuccess(
          QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS,
          response.Response.QRCodeTimeWiseDetailDetails.map(item => ({ ...item, Time: fromDate }))
        ));
      } else {
        dispatch(completeActionWithSuccess(QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS, []));
      }
    } catch (error) {
      dispatch(completeActionWithError(QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS, error));
    }
  }
}

export const fetchQRCodeStatement = (mobileno, fromMonth, fromYear, toMonth, toYear) => {
  return async function(dispatch) {
    try {
      dispatch(startAction(QRCodeActionsType.GET_SCANNED_QR_CODE_STATEMENT));

      const response = await fetchQRCodeStatementApi(mobileno, fromMonth, fromYear, toMonth, toYear);
      console.log("response is ssss :: " , response);
      if (response && response.Response && response.Response.AccountStatementDetails) {
        dispatch(completeActionWithSuccess(
          QRCodeActionsType.GET_SCANNED_QR_CODE_STATEMENT,
          response.Response.AccountStatementDetails
        ));
      } else {
        dispatch(completeActionWithSuccess(QRCodeActionsType.GET_SCANNED_QR_CODE_STATEMENT, []));
      }
    } catch (error) {
      dispatch(completeActionWithError(QRCodeActionsType.GET_SCANNED_QR_CODE_STATEMENT, error));
    }
  }
}


export const fetchQRCodeStatusForBU = (mobileno, buname, dates) => {
  return async function(dispatch) {
    try {
      dispatch(startAction(QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS));

      let result = [];
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        let response = await fetchQRCodeDatewiseStatusApi(mobileno, date);
        if (response && response.Response && response.Response.QRCodeDateWiseDetails) {
          const datewiseResults = response.Response.QRCodeDateWiseDetails; 
          for (let j = 0; j < datewiseResults.length; j++) {
            const status = datewiseResults[j];
            if (status.BUName === buname) {
              response = await fetchQRCodeTimewiseStatusApi(mobileno, status.Time);
              if (response && response.Response && response.Response.QRCodeTimeWiseDetailDetails) {
                const filtered = response.Response.QRCodeTimeWiseDetailDetails.filter(item => item.BUName === buname);
                result = [...result, ...filtered.map(item => ({ ...item, Time: status.Time }))];
              }
            }
          };
        }
      };
      dispatch(completeActionWithSuccess(QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS, result));
    } catch (error) {
      dispatch(completeActionWithError(QRCodeActionsType.GET_SCANNED_QR_CODE_TIMEWISE_STATUS, error));
    }
  }
}

export const fetchRetailerPreScanDetail = (mobileno) => {
  return async function(dispatch) {
    try {
      dispatch(startAction(QRCodeActionsType.GET_PRE_SCAN_DETAIL));

      const response = await fetchRetailerPreScanDetailApi(mobileno);
      console.log("respinse is: " , response);
      if (response && response.Response && response.Response.MissedScanDetails) {
        dispatch(completeActionWithSuccess(
          QRCodeActionsType.GET_PRE_SCAN_DETAIL,
          response.Response.MissedScanDetails
        ));
      } else {
        dispatch(completeActionWithSuccess(QRCodeActionsType.GET_PRE_SCAN_DETAIL, []));
      }
    } catch (error) {
      dispatch(completeActionWithError(QRCodeActionsType.GET_PRE_SCAN_DETAIL, error));
    }
  }
}
