/**
 * @class       : authorization
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 17:29:53 IST
 * @description : authorization
 */


import { apiClient } from './api';

export const loginApi = async ({ mobileno, password, deviceId, osType }) => {
  const response = await apiClient.post('/Login', {
    MobileNo: mobileno,
    Password: password,
    DeviceId: deviceId,
    OSType: osType,
  });

  return response;
};

export const forgotPasswordApi = async (mobileno) => {
  const response = await apiClient.post('/ForgotPassword', {
    MobileNo: mobileno
  });

  return response;
};

export const userPrivilegeApi = async (mobileno, memberType) => {
  const response= await apiClient.post('/UserPrivilegeAPI', {
    MobileNo: mobileno,
    MemberType: memberType
  });
  return response;
};

export const fetchSignUpInstructionApi = async () => {
  return await apiClient.post('/SignUpInstruction');
}

export const signUpRetailerApi = async (profile) => {
  return await apiClient.post('/SignUpRetailerAPI', profile);
};

export const salesExecutiveSignUpRetailerApi = async (profile) => {
  return await apiClient.post('/SaleExecRetailerEnrollAPI', profile);
};


export const fetchTermsAndConditionsApi = async () => {
  return await apiClient.post('/TermandCondition', { });
};

export const acceptTNCApi = async (mobileno) => {
  const response = await apiClient.post('/AcceptTNC', {
    MobileNo: mobileno
  });
  return response;
};

export const fetchProfileDetailApi = async (mobileno) => {
  const response= await apiClient.post('/GetProfileAPI', {
    MobileNo: mobileno
  });
  return response;
};

export const changePasswordApi = async (mobileno, oldPassword, newPassword) => {
  const response= await apiClient.post('/ChangePassword', {
    MobileNo: mobileno,
    OldPassword: oldPassword,
    NewPassword: newPassword
  });
  return response;
};

export const updateBankDetailApi = async (bankDetail) => {
  return await apiClient.post('/UpdateBankDetailAPI', bankDetail);
};

export const fetchBankDetailStatusApi = async (MobileNo) => {
  return await apiClient.post('/LoginBankDetailAPI', { MobileNo });
};

export const fetchUserDashDataApi = async (MobileNo) => {
  return await apiClient.post('/RetailerBasicDetailAPI', { MobileNo });
};
