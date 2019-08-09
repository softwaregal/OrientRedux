/**
 * @class       : ScreenName
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 13:15:28 IST
 * @description : ScreenName
 */

import { ModuleName } from '../../constants';

export default class ScreenName {
  static APP_HOME = 'APP_HOME';
  static APP_CONTACTUS = 'APP_CONTACTUS';
  static APP_ABOUTUS = 'APP_ABOUTUS';
  static APP_MY_PROFILE = 'APP_MY_PROFILE';
  static LOGOUT = 'LOGOUT';
  static APP_CHANGE_PASSWORD = 'APP_CHANGE_PASSWORD';
  static APP_NOTIFICATION = 'APP_NOTIFICATION';
  static APP_BANK_DETAIL = 'APP_BANK_DETAIL';
};

export const screenToModuleNameMap = {
  [ScreenName.APP_MY_PROFILE]: ModuleName.MY_PROFILE,
  [ScreenName.APP_NOTIFICATION]: ModuleName.NOTIFICATION,
  [ScreenName.APP_CHANGE_PASSWORD]: ModuleName.CHANGE_PASSWORD,
  [ScreenName.APP_CONTACTUS]: ModuleName.CONTACT_US,
  [ScreenName.APP_ABOUTUS]: ModuleName.ABOUT_US,
  [ScreenName.APP_BANK_DETAIL]: ModuleName.BANK,
};
