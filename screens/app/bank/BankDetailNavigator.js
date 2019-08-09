/**
 * @class       : DashboardNavigator
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 12:35:55 IST
 * @description : DashboardNavigator
 */

import { createStackNavigator } from 'react-navigation';

import BankDetailComponent from './BankDetailComponent';
import Notification from '../notification/Notification';

import ScreenName from './ScreenName';
import { defaultStackbarNavigatorOptions } from '../../../res/Styles';

const screens = {};

screens[ScreenName.BANK_DETAIL] = {
  screen: BankDetailComponent,
  params : {
    title: 'Bank Details',
    showDrawerMenuButton: true,
    notificationScreen: ScreenName.BANK_NOTIFICATION,
  }
}

screens[ScreenName.BANK_NOTIFICATION] = { screen: Notification }

const Navigator = createStackNavigator(screens, {
  defaultNavigationOptions: defaultStackbarNavigatorOptions,
});

export default Navigator;
