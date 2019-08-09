/**
 * @class       : DashboardNavigator
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 12:35:55 IST
 * @description : DashboardNavigator
 */

import React, {Component}  from 'react';

import { createStackNavigator } from 'react-navigation';

import Home from './Home';
import Dashboard from './Dashboard';
import ScanQRCode from './ScanQRCode';
import SubmitQRCodeStatus from './SubmitQRCodeStatus';
import QRCodeHistory from './QRCodeHistory';
import QRCodeHistoryDatewise from './QRCodeHistoryDatewise';
import QRCodeHistoryTimewise from './QRCodeHistoryTimewise';
import QRCodeStatement from './QRCodeStatement';
import ContactUs from '../help/ContactUs';
import RegisterComplaint from '../help/RegisterComplaint';
import AboutUs from '../help/AboutUs';
import MyProfile from './MyProfile';
import UserRegistration from '../../auth/UserRegistration';
import OTPVerification from '../../auth/OTPVerification';
import FreedomFortune from './FreedomFortune';
import Notification from '../notification/Notification';
import BankDetailComponent from '../bank/BankDetailComponent';
import StatusSummary from './StatusSummary';
import PreScannedQRCodeList from './PreScannedQRCodeList';

import { giftingScreens } from '../gifting/GiftingNavigator';
import { isRetailer } from '../../../utils';
import ImageButton from '../../../components/ImageButton';

import ScreenName from './ScreenName';
import { defaultStackbarNavigatorOptions } from '../../../res/Styles';

const screens = {};

screens[ScreenName.DASHBOARD_HOME] = {
  screen: Dashboard,
  params : {
    showDrawerMenuButton: true,
    notificationScreen: ScreenName.DASHBOARD_NOTIFICATION,
  }
}
screens[ScreenName.DASHBOARD_RETAILER_DEMO_HOME] = { screen: Home, params : { title: 'Hi Retailer', retailerDemoHome: true }}
screens[ScreenName.DASHBOARD_SCAN_QRCODE] = { screen: ScanQRCode, params : { title: 'Scan QR Code' } }
screens[ScreenName.DASHBOARD_SUBMIT_QRCODE_STATUS] = { screen: SubmitQRCodeStatus, params : { title: 'Scan QR Code Status' } }
screens[ScreenName.DASHBOARD_QRCODE_HISTORY] = { screen: QRCodeHistory, params : { title: 'Scan History' } }
screens[ScreenName.DASHBOARD_QRCODE_HISTORY_DATEWISE] = { screen: QRCodeHistoryDatewise, params : { title: 'Status of Scanned QR Code' } }
screens[ScreenName.DASHBOARD_QRCODE_HISTORY_TIMEWISE] = { screen: QRCodeHistoryTimewise, params : { title: 'Status of Scanned QR Code' } }
screens[ScreenName.DASHBOARD_QRCODE_STATEMENT] = { screen: QRCodeStatement, params : { title: 'Account Statement' } }
screens[ScreenName.DASHBOARD_CONTACTUS] = { screen: ContactUs, params : { title: 'Contact Us', complaintScreen: ScreenName.DASHBOARD_REGISTER_COMPLAINT} }
screens[ScreenName.DASHBOARD_REGISTER_COMPLAINT] = { screen: RegisterComplaint, params : { title: 'Query / Suggestions' } }
screens[ScreenName.DASHBOARD_ABOUTUS] = { screen: AboutUs, params : { title: 'About Us' }}
screens[ScreenName.DASHBOARD_MY_PROFILE] = { screen: MyProfile, params : { title: 'My Profile' }}
screens[ScreenName.DASHBOARD_STATUS_SUMMARY] = { screen: StatusSummary, params : { title: 'Status Summary' }}
screens[ScreenName.DASHBOARD_QRCODE_PRE_SCAN_SUMMARY] = { screen: PreScannedQRCodeList, params : { title: 'Pre Scanned QRCode' }}
screens[ScreenName.DASHBOARD_RETAILER_SIGNUP] = {
  screen: UserRegistration,
  params : {
    title: 'Retailer Sign Up',
    otpVerificationScreen: ScreenName.DASHBOARD_RETAILER_VERIY_OTP,
    retailerSignUp: true,
  }
}
screens[ScreenName.DASHBOARD_RETAILER_VERIY_OTP] = {
  screen: OTPVerification,
  params : {
    title: 'Retailer OTP Verification',
    retailerSignUp: true,
  }
}

screens[ScreenName.DASHBOARD_BANK] = { screen: BankDetailComponent, params : { title: 'Bank Details' }}

screens[ScreenName.DASHBOARD_FREEDOM_FORTUNE] = { screen: FreedomFortune, params : { title: 'Freedom Fortune' } }
screens[ScreenName.DASHBOARD_NOTIFICATION] = { screen: Notification }

const Navigator = createStackNavigator(Object.assign(screens, giftingScreens), {
  defaultNavigationOptions: defaultStackbarNavigatorOptions,
  // initialRouteName: 'DASHBOARD_STATUS_SUMMARY',
});

const mapStateToProps = (state) => {
  const profile = getUserProfile(state);
  console.log("profile is " + profile);
  return { profile};
};


export default Navigator;
