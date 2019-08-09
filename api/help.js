/**
 * @class       : help
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 09, 2019 12:56:26 IST
 * @description : help
 */

import { apiClient } from './api';

export const contactUsApi = async () => {
  return await apiClient.post('/ContactUs');
}

export const aboutUsApi = async () => {
  return await apiClient.post('/AboutUs');
}

export const addComplainApi = async (mobileno, complain) => {
  const response= await apiClient.post('/ComplainAPI', {
    MobileNo: mobileno,
    Complain: complain
  });
  return response;
};

export const fetchStateCityMappingApi  = async () => {
  return await apiClient.post('/StateCityMappingAPI');
}

export const fetchBankNameApi  = async () => {
  return await apiClient.post('/BankNameListAPI');
}


export const fetchBUCategoryApi = async () => {
  return await apiClient.post('/GetBuCategory', {});
}

export const fetchAppVersionApi = async () => {
  return await apiClient.post('/GetAPPVersionAPI', {});
}
