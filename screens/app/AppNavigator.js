/**
 * @class       : AppNavigator
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 13:14:25 IST
 * @description : AppNavigator
 */

import React, { Component } from 'react';
import { Platform, Image, View, StyleSheet } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import DashboardNavigator from './dashboard/DashboardNavigator';
import HelpNavigator from './help/HelpNavigator';
import BankDetailNavigator from './bank/BankDetailNavigator';
import AboutUs from './help/AboutUs';
import MyProfile from './dashboard/MyProfile';
import ChangePassword from '../auth/ChangePassword';
import Sidebar from './Sidebar';
import Notification from './notification/Notification';

import { defaultStackbarNavigatorOptions } from '../../res/Styles';
import { Colors, IconSize } from '../../res';
import ScreenName from './ScreenName';
import DashbordScreenName from './dashboard/ScreenName';

const NotificationScreen = { screen: Notification };
const AboutUsNavigator = createStackNavigator({
  [ScreenName.APP_ABOUTUS]: {
    screen: AboutUs,
    params : {
      title: 'About Us',
      showDrawerMenuButton: true,
      notificationScreen: DashbordScreenName.DASHBOARD_NOTIFICATION,
    }
  },
  [DashbordScreenName.DASHBOARD_NOTIFICATION]: NotificationScreen,
}, {
  defaultNavigationOptions: defaultStackbarNavigatorOptions,
});

const MyProfileNavigator = createStackNavigator({
  [ScreenName.APP_MY_PROFILE]: {
    screen: MyProfile,
    params : {
      title: 'My Profile',
      showDrawerMenuButton: true,
      notificationScreen: DashbordScreenName.DASHBOARD_NOTIFICATION,
    }
  },
  [DashbordScreenName.DASHBOARD_NOTIFICATION]: NotificationScreen,
}, {
  defaultNavigationOptions: defaultStackbarNavigatorOptions,
});

const ChangePasswordNavigator = createStackNavigator({
  [ScreenName.APP_CHANGE_PASSWORD]: {
    screen: ChangePassword,
    params : {
      title: 'Change Password',
      showDrawerMenuButton: true,
      notificationScreen: DashbordScreenName.DASHBOARD_NOTIFICATION,
    }
  },
  [DashbordScreenName.DASHBOARD_NOTIFICATION]: NotificationScreen,
}, {
  defaultNavigationOptions: defaultStackbarNavigatorOptions,
});

const NotificationNavigator = createStackNavigator({
  [ScreenName.APP_NOTIFICATION]: {
    screen: Notification,
    params : {
      showDrawerMenuButton: true,
      notificationScreen: DashbordScreenName.DASHBOARD_NOTIFICATION,
    }
  },
  [DashbordScreenName.DASHBOARD_NOTIFICATION]: NotificationScreen,
}, {
  defaultNavigationOptions: defaultStackbarNavigatorOptions,
});

const screens = {};

screens[ScreenName.APP_HOME] = { screen: DashboardNavigator, params: { title: 'Home'} };
screens[ScreenName.APP_MY_PROFILE] = { screen: MyProfileNavigator, params: { title: 'My Profile'} };
screens[ScreenName.APP_NOTIFICATION] = { screen: NotificationNavigator, params: { title: 'Notification'} };
screens[ScreenName.APP_CHANGE_PASSWORD] = { screen: ChangePasswordNavigator, params: { title: 'Change Password'} };
screens[ScreenName.APP_CONTACTUS] = { screen: HelpNavigator, params: { title: 'Contact Us'} };
screens[ScreenName.APP_ABOUTUS] = { screen: AboutUsNavigator, params: { title: 'About Us'} };
/*screens[ScreenName.APP_BANK_DETAIL] = { screen: BankDetailNavigator, params: { title: 'Bank Details'} };*/

const navigator = createDrawerNavigator(screens, {
  contentComponent: props => <Sidebar {...props} />,
  defaultNavigationOptions: ({ navigation }) => {
    return Object.assign(defaultStackbarNavigatorOptions({navigation}), {
      drawerIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconSource = null;
        if (routeName === ScreenName.APP_HOME) {
          iconSource = { uri: 'home' }
        } else if (routeName === ScreenName.APP_CONTACTUS || routeName === ScreenName.APP_BANK_DETAIL) {
          iconSource = { uri: Platform.select({ ios: 'icon_contactUS', android: 'contact' }) }
        } else if (routeName === ScreenName.APP_ABOUTUS) {
          iconSource = { uri: 'about' }
        } else if (routeName === ScreenName.APP_MY_PROFILE) {
          iconSource = { uri: 'my_account' }
        } else if (routeName === ScreenName.APP_CHANGE_PASSWORD) {
          iconSource = { uri: 'change_password' }
        } else if (routeName === ScreenName.APP_NOTIFICATION) {
          iconSource = Platform.select({
            android: { uri: 'noti' },
            ios: { uri: 'noti_grey' }
          });
        }
        if (iconSource !== null) {
          return (<Image source={iconSource} style={{ width: IconSize.SMALL, height: IconSize.SMALL}} tintColor={tintColor} />);
        }
        return null;
      }
    })
  },
  contentOptions: {
    activeTintColor: Colors.SECONDARY_TEXT,
      inactiveTintColor: Colors.SECONDARY_TEXT,
      itemsContainerStyle: {
        marginVertical: 0,
      },
      iconContainerStyle: {
        opacity: 1
      }
  },
});

export default navigator;
