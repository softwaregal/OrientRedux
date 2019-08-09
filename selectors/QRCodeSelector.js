/**
 * @class       : QRCodeSelector
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 11, 2019 10:12:07 IST
 * @description : QRCodeSelector
 */

export const getScannedQRCodes = state => state.qrcode.scannedQRCodes;
export const getScannedAndRewardedQRCodes = state => state.qrcode.scannedAndRewardedQRCodes;
export const getQRCodeStatus = state => state.qrcode.QRCodeStatus;
export const getQRCodeDatewiseStatus = state => state.qrcode.QRCodeDatewiseStatus;
export const getQRCodeTimewiseStatus = state => state.qrcode.QRCodeTimewiseStatus;
export const getQRCodeStatement = state => state.qrcode.QRCodeStatement;
export const getQRCodePreScanDetails = state => state.qrcode.qrCodePreScanDetails;
