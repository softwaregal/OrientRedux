/**
 * @class       : AuthNavigator
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 12:16:52 IST
 * @description : AuthNavigator
 */

import { createStackNavigator } from 'react-navigation';

import AuthHome from './AuthHome';
import Login from './Login';
import UserRegistration from './UserRegistration'
import SignUpInstruction from './SignUpInstruction'
import OTPVerification from './OTPVerification'
import TermsAndCondition from './TermsAndCondition'

import ScreenName from './ScreenName';
import { defaultStackbarNavigatorOptions } from '../../res/Styles';

const screens = {};

screens[ScreenName.AUTH_HOME] = { screen: AuthHome, params : { title: 'Orient Connect' } }
screens[ScreenName.AUTH_LOGIN] = { screen: Login, params : { title: 'Login Console' } }
screens[ScreenName.AUTH_INSTRUCTION] = { screen: SignUpInstruction, params : { title: 'Sign Up Instructions' } }
screens[ScreenName.AUTH_SIGNUP] = {
  screen: UserRegistration,
  params : {
    title: 'Sign Up',
    otpVerificationScreen: ScreenName.OTP_VERIFICATION,
  }
}

screens[ScreenName.OTP_VERIFICATION] = { screen: OTPVerification, params : { title: 'Verify OTP' } }
screens[ScreenName.AUTH_TNC] = { screen: TermsAndCondition, params : { title: 'Terms & Conditions' } }

const Navigator = createStackNavigator(screens, {
  defaultNavigationOptions: defaultStackbarNavigatorOptions,
});

export default Navigator;
