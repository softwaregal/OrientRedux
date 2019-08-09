/**
 * @class       : qrcode
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 10, 2019 19:05:24 IST
 * @description : qrcode
 */

import { apiClient } from './api';

export const validateQrCodeApi = async (mobileno, qrcode, reward = false) => {
   
   console.log('reward is: ', reward);

   return await apiClient.post('/QRCodeSubmitAPI', {
    MobileNo: mobileno,
    QRCode: qrcode,
    Flag: (reward ? '1' : '0')
  });
};

export const fetchQRCodeStatusApi = async (mobileno, fromDate, toDate) => {
  return await apiClient.post('/StatusScannedQRCodeAPI', {
    MobileNo: mobileno,
    FromDate: fromDate,
    ToDate: toDate,
  });
};

export const fetchQRCodeDatewiseStatusApi = async (mobileno, fromDate) => {
   return await apiClient.post('/ScannedQRCodeDateWiseAPI', {
    MobileNo: mobileno,
    FromDate: fromDate,
  });
};

export const fetchQRCodeTimewiseStatusApi = async (mobileno, fromDate) => {
   return await apiClient.post('/QRCodeTimeWiseAPI', {
    MobileNo: mobileno,
    FromDate: fromDate,
  });
};

export const fetchQRCodeStatementApi = async (mobileno, fromDate, toDate) => {
  const body = {
    MobileNo: mobileno,
    FromDate: fromDate,
    ToDate: toDate,
  };
  console.log(body);
  return await apiClient.post('/AccountStatementAPI', body);
};

export const fetchRetailerPreScanDetailApi = async (mobileno) => {
  const body = {
    MobileNo: mobileno,
  };
  console.log(body);
  return await apiClient.post('/RetailerPreScanDetailAPI', body);
};
