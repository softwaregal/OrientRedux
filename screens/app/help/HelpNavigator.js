/**
 * @class       : DashboardNavigator
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 12:35:55 IST
 * @description : DashboardNavigator
 */

import { createStackNavigator } from 'react-navigation';

import ContactUs from './ContactUs';
import RegisterComplaint from './RegisterComplaint';
import Notification from '../notification/Notification';

import ScreenName from './ScreenName';
import { defaultStackbarNavigatorOptions } from '../../../res/Styles';

const screens = {};

screens[ScreenName.HELP_CONTACTUS] = {
  screen: ContactUs,
  params : {
    title: 'Contact Us',
    complaintScreen: ScreenName.HELP_REGISTER_COMPLAINT,
    showDrawerMenuButton: true,
    notificationScreen: ScreenName.HELP_NOTIFICATION,
  }
}
screens[ScreenName.HELP_REGISTER_COMPLAINT] = { screen: RegisterComplaint, params : { title: 'Query / Suggestions' } }
screens[ScreenName.HELP_NOTIFICATION] = { screen: Notification }

const Navigator = createStackNavigator(screens, {
  defaultNavigationOptions: defaultStackbarNavigatorOptions,
});

export default Navigator;
