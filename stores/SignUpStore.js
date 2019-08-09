/**
 * @class       : SignUpStore
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 16, 2019 12:49:12 IST
 * @description : SignUpStore
 */

import { ActionStatus } from '../actions/action';
import { AuthorizationActionTypes } from '../actions/AuthorizationActions';
import { HelpActionTypes } from '../actions/helpActions';
import { fromDateString, SignUpStep } from '../utils';
import { UserActionTypes } from '../actions/UserActions';

const profile = {
  Name : 'Vikash',
  MobileNo: '8130526968',
  DateofBirth: fromDateString('20-Jun-1990'),
  NameoftheFirm: 'Gulaab Jamun',
  FirmAddress: 'NOIDA',
  FirmState: 'UTTAR PRADESH',
  FirmCity: 'NOIDA',
  FirmPinCode: '201301',
  Password: '1234567',
  ConfirmPassword: '1234567',
  EmailId: 'a@abc.com',
  AadharCardNumber: '123456654321',
  BUName: 'Fans,VFan',
};

const defaultState = {
  signUpInstruction: null,
  BUCategories: [],
  profile: null,
  userDashData: {},
  stateCityMapping: null,
  TermandCondition: null,
  signUpStep: SignUpStep.PROFILE_DETAIL,
  bankDetail : [],
  bankDetailStatus: { status: true },
};

const signUpStore = (state = defaultState, action) => {
  if (action.type === UserActionTypes.REMOVE_USER &&
    action.actionStatus === ActionStatus.COMPLETE_WITH_SUCCESS) {
    return defaultState;
  }
  if (action.actionStatus !== ActionStatus.COMPLETE_WITH_SUCCESS) {
    return state;
  }

  switch(action.type) {
    case AuthorizationActionTypes.RESET_SIGNUP:
      return Object.assign({}, state, { signUpStep: SignUpStep.PROFILE_DETAIL, profile: null });

    case HelpActionTypes.GET_BANK_LIST:
      return Object.assign({}, state, { bankDetail: action.payload });


    case AuthorizationActionTypes.FETCH_SIGNUP_INSTRUCTION:
      return Object.assign({}, state, { signUpInstruction: action.payload });
  case HelpActionTypes.FETCH_STATE_CITY_MAPPING:
      {
         const stateCityMapping = action.payload.reduce((obj, state) => {
           obj[state.StateName] = state.CityTypeDetails ? state.CityTypeDetails.map(city => city.CityName) : [];
           return obj;
         }, {});
        return Object.assign({}, state, { stateCityMapping, signUpStep: SignUpStep.PROFILE_DETAIL });
      }
  case HelpActionTypes.FETCH_BU_CATEGORIES:
      {
         const BUCategories = action.payload.map(category => category.BuName);
        return Object.assign({}, state, { BUCategories, signUpStep: SignUpStep.PROFILE_DETAIL });
      }

    case AuthorizationActionTypes.SIGNUP_RETAILER:
    case AuthorizationActionTypes.VERIFY_OTP:
      {
        const { OTP, ...rest } = action.payload;
        const profile = { ...rest };
        if (profile.DateofBirth) {
          profile.DateofBirth = fromDateString(profile.DateofBirth);
        }
        if (profile.WeddingAnniversary) {
          profile.WeddingAnniversary = fromDateString(profile.WeddingAnniversary);
        }
        if (profile.SpouseDOB) {
          profile.SpouseDOB = fromDateString(profile.SpouseDOB);
        }
        if (profile.Child1DOB) {
          profile.Child1DOB = fromDateString(profile.Child1DOB);
        }
        if (profile.Child2DOB) {
          profile.Child2DOB = fromDateString(profile.Child2DOB);
        }
        if (profile.Child3DOB) {
          profile.Child3DOB = fromDateString(profile.Child3DOB);
        }
        const signUpStep = action.type === AuthorizationActionTypes.SIGNUP_RETAILER ?
          SignUpStep.VERIFY_OTP :
          SignUpStep.SIGNUP_COMPLETE;
        return Object.assign({}, state, { profile, signUpStep });
      }

    case AuthorizationActionTypes.FETCH_TERMS_AND_CONDITIONS:
      return Object.assign({}, state, { TermandCondition: action.payload, signUpStep: SignUpStep.PROFILE_DETAIL });

    case AuthorizationActionTypes.FETCH_BANK_DETAIL_STATUS:
      return Object.assign({}, state, { bankDetailStatus: action.payload });

    case AuthorizationActionTypes.FETCH_USER_DASH_DATA:
      return Object.assign({}, state, { userDashData: action.payload });

    default:
      return state;
  }
  return state;
}

export default signUpStore;
