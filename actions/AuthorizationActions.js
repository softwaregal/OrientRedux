/**
 * @class       : AuthorizationActions
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 18:04:46 IST
 * @description : AuthorizationActions
 */

import {
  loginApi,
  forgotPasswordApi,
  userPrivilegeApi,
  fetchSignUpInstructionApi,
  signUpRetailerApi,
  fetchTermsAndConditionsApi,
  acceptTNCApi,
  fetchProfileDetailApi,
  salesExecutiveSignUpRetailerApi,
  changePasswordApi,
  updateBankDetailApi,
  fetchBankDetailStatusApi,
  fetchUserDashDataApi,
} from '../api/authorization';

import { updateUser, removeUser } from './UserActions';
import { startAction, completeActionWithSuccess, completeActionWithError } from './action';
import { showMessage } from './MessageActions';
import { getUserProfile } from '../selectors/UserSelector';

export const AuthorizationActionTypes = {
  LOGIN: 'LOGIN',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  FETCH_USER_PRIVILEDGE: 'FETCH_USER_PRIVILEDGE',
  FETCH_SIGNUP_INSTRUCTION: 'FETCH_SIGNUP_INSTRUCTION',
  FETCH_TERMS_AND_CONDITIONS: 'FETCH_TERMS_AND_CONDITIONS',
  FETCH_PROFILE_DETAIL: 'FETCH_PROFILE_DETAIL',
  SIGNUP_RETAILER: 'SIGNUP_RETAILER',
  VERIFY_OTP: 'VERIFY_OTP',
  ACCEPT_TERMS_AND_CONDITIONS: 'ACCEPT_TERMS_AND_CONDITIONS',
  RESET_SIGNUP: 'RESET_SIGNUP',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  UPDATE_BANK_DETAIL: 'UPDATE_BANK_DETAIL',
  FETCH_BANK_DETAIL_STATUS: 'FETCH_BANK_DETAIL_STATUS',
  FETCH_USER_DASH_DATA:"FETCH_USER_DASH_DATA",
}

export const login = ({ mobileno, password, deviceId, osType }) => {
  return async function (dispatch) {
    
    try {
      const profile = await loginApi({ mobileno, password, deviceId, osType });
      dispatch(updateUser(profile));
      dispatch(fetchUserPrivilege(profile.RegisteredMobileNo, profile.MemberType));
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.LOGIN));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.LOGIN, `${error.message}`));
    }
  }
}

export const forgotPassword = (mobileno) => {
  return async function (dispatch) {
    try {
      dispatch(startAction(AuthorizationActionTypes.FORGOT_PASSWORD));
      const response = await forgotPasswordApi(mobileno);
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FORGOT_PASSWORD, response));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.FORGOT_PASSWORD, error));
    }
  }
}

export const fetchUserPrivilege = (mobileno, memberType) => {
  return async function (dispatch) {
    try {
      const response = await userPrivilegeApi(mobileno, memberType);
      if (response && response.Response && response.Response.Menu) {
        dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_USER_PRIVILEDGE, response.Response.Menu));
      } else {
        throw new Error('Invalid response for user privilege');
      }
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.FETCH_USER_PRIVILEDGE, error));
    }
  }
}

export const fetchSignUpInstruction = () => {
  return async function (dispatch) {
    try {
      dispatch(startAction(AuthorizationActionTypes.FETCH_SIGNUP_INSTRUCTION));
      const response = await fetchSignUpInstructionApi();
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_SIGNUP_INSTRUCTION, response.Response.SignUpInstruction));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.FETCH_SIGNUP_INSTRUCTION, error));
    }
  }
}

export const signUpRetailer = (profile) => {
  return async function (dispatch) {
    const action = profile.OTP ? AuthorizationActionTypes.VERIFY_OTP : AuthorizationActionTypes.SIGNUP_RETAILER;
    try {
      console.log('Profile data is : ' , profile.TypeofRetailer);
      dispatch(startAction(action));
      const response = await signUpRetailerApi(profile);
      dispatch(completeActionWithSuccess(action, profile));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(action, error));
    }
  }
}

export const salesExecutiveSignUpRetailer = (profile, salesExecutiveProfile) => {
  return async function (dispatch) {
    const action = profile.OTP ? AuthorizationActionTypes.VERIFY_OTP : AuthorizationActionTypes.SIGNUP_RETAILER;
    try {
      console.log('Profile data is : ' , profile.TypeofRetailer);
      profile.SalesExecutiveName = salesExecutiveProfile.RetailerName;
      profile.SEMobileNumber = salesExecutiveProfile.RegisteredMobileNo;
      
      dispatch(startAction(action));
      const response = await salesExecutiveSignUpRetailerApi(profile);
      console.log('Sales executiev Sinp up response', response);
      dispatch(completeActionWithSuccess(action, profile));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(action, error));
    }
  }
}

export const verifyOTP = (profile, acceptTermsAndConditions = false) => {
  return async function (dispatch) {
    try {
      dispatch(startAction(AuthorizationActionTypes.VERIFY_OTP));
      let response = await signUpRetailerApi(profile);
      if (acceptTermsAndConditions) {
        // response = await acceptTNCApi(profile.MobileNo);
      }
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.VERIFY_OTP, profile));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.VERIFY_OTP, error));
    }
  }
}

export const fetchTermsAndConditions = () => {
  return async function (dispatch) {
    try {
      dispatch(startAction(AuthorizationActionTypes.FETCH_TERMS_AND_CONDITIONS));
      const response = await fetchTermsAndConditionsApi();
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_TERMS_AND_CONDITIONS, response.TermandCondition));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.FETCH_TERMS_AND_CONDITIONS, error));
    }
  }
}

export const acceptTNC = (mobileno) => {
  return async function (dispatch, getState) {
    try {
      dispatch(startAction(AuthorizationActionTypes.ACCEPT_TERMS_AND_CONDITIONS));
      const response = await acceptTNCApi(mobileno);
      const profile = getUserProfile(getState());
      profile.IsTNCAccept = 'Y';
      dispatch(updateUser(profile));
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.ACCEPT_TERMS_AND_CONDITIONS));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.ACCEPT_TERMS_AND_CONDITIONS, error));
    }
  }
}

export const fetchProfileDetail = (mobileno) => {
  return async function (dispatch) {
    try {
      dispatch(startAction(AuthorizationActionTypes.FETCH_PROFILE_DETAIL));
      const response = await fetchProfileDetailApi(mobileno);
      const { ErrorCode, ErrorMessage, ...rest } = response;
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_PROFILE_DETAIL, { ...rest }));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.FETCH_PROFILE_DETAIL, error));
    }
  }
}

export const resetSignUp = () => {
  return async function (dispatch) {
    dispatch(completeActionWithSuccess(AuthorizationActionTypes.RESET_SIGNUP));
  }
}

export const changePassword = (mobileno, oldPassword, newPassword) => {
  return async function (dispatch) {
    try {
      dispatch(startAction(AuthorizationActionTypes.CHANGE_PASSWORD));
      const response = await changePasswordApi(mobileno, oldPassword, newPassword);
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.CHANGE_PASSWORD));
      dispatch(removeUser());
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.CHANGE_PASSWORD, error));
    }
  }
}

export const updateBankDetail = (bankDetail) => {
  return async function (dispatch) {
    try {
      dispatch(startAction(AuthorizationActionTypes.UPDATE_BANK_DETAIL));
      const response = await updateBankDetailApi(bankDetail);
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.UPDATE_BANK_DETAIL));
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_BANK_DETAIL_STATUS, {
        status: true
      }));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(AuthorizationActionTypes.UPDATE_BANK_DETAIL, error));
    }
  }
}

export const fetchBankDetailStatus = (MobileNo) => {
  return async function (dispatch) {
    try {
      const response = await fetchBankDetailStatusApi(MobileNo);
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_BANK_DETAIL_STATUS, {
        status: true,
        message: response.ErrorMessage,
      }));
    } catch (error) {
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_BANK_DETAIL_STATUS, {
        status: false,
        message: error.message
      }));
    }
  }
}


export const fetchUseDashData = (MobileNo) => {
  return async function (dispatch) {
    try {
      const response = await fetchUserDashDataApi(MobileNo);
      console.log("response is : ========== " + JSON.stringify(response));
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_USER_DASH_DATA, response));
    } catch (error) {
      dispatch(completeActionWithSuccess(AuthorizationActionTypes.FETCH_USER_DASH_DATA, {
        status: false,
        message: error.message
      }));
    }
  }
}
