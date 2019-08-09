/**
 * @class       : help
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 09, 2019 13:11:00 IST
 * @description : help
 */

import { startAction, completeActionWithSuccess, completeActionWithError } from "./action"

import { getContactUsList, getAboutUsHtml } from '../selectors/helpSelector';
import {
  contactUsApi,
  addComplainApi,
  aboutUsApi,
  fetchStateCityMappingApi,
  fetchBUCategoryApi,
  fetchAppVersionApi,
  fetchBankNameApi,
} from '../api/help';
import { showMessage } from './MessageActions';

export const HelpActionTypes = {
  FETCH_CONTACT_US: 'FETCH_CONTACT_US',
  FETCH_ABOUT_US: 'FETCH_ABOUT_US',
  FETCH_STATE_CITY_MAPPING: 'FETCH_STATE_CITY_MAPPING',
  FETCH_BU_CATEGORIES: 'FETCH_BU_CATEGORIES',
  FETCH_APP_VERSION: 'FETCH_APP_VERSION',
  ADD_COMPLAIN: 'ADD_COMPLAIN',
  RESET_APP_VERSION : 'RESET_APP_VERSION',
  GET_BANK_LIST : 'GET_BANK_LIST',
};


export const fetchBankListData = () => {
  return async function (dispatch, getState) {
    try {
      console.log('jdsvsdvsdvoisvd');
      dispatch(startAction(HelpActionTypes.GET_BANK_LIST));

      const response = (await fetchBankNameApi()).Response.BankNameListDetails;
      var mappedValue = response.map(bank => ({'label' : bank.Name, 'value' : bank.Code}) )
      console.log("sdkvgsdvsdkuvgsdb", mappedValue , response);
      dispatch(completeActionWithSuccess(HelpActionTypes.GET_BANK_LIST, mappedValue));
    } catch (error) {
      console.log(error);
      dispatch(completeActionWithError(HelpActionTypes.GET_BANK_LIST, error));
    }
  };
}

export const fetchContactUs = () => {
  return async function (dispatch, getState) {
    const list = getContactUsList(getState());

    /*if (list && list.length > 0) {
      return;
    }*/
    try {
      dispatch(startAction(HelpActionTypes.FETCH_CONTACT_US));
      const response = await contactUsApi();
      dispatch(completeActionWithSuccess(HelpActionTypes.FETCH_CONTACT_US, response));
    } catch (error) {

      dispatch(completeActionWithError(HelpActionTypes.FETCH_CONTACT_US, error));
    }
  };
}

export const fetchAboutUs = () => {
  return async function (dispatch, getState) {
    const aboutUsHtml = getAboutUsHtml(getState());

    if (aboutUsHtml) {
      return;
    }
    try {
      dispatch(startAction(HelpActionTypes.FETCH_ABOUT_US));
      const response = await aboutUsApi();
      dispatch(completeActionWithSuccess(HelpActionTypes.FETCH_ABOUT_US, response));
    } catch (error) {
      dispatch(completeActionWithError(HelpActionTypes.FETCH_ABOUT_US, error));
    }
  };
}

export const addComplain = (mobileno, complain) => {
  return async function (dispatch) {
    try {
      dispatch(startAction(HelpActionTypes.ADD_COMPLAIN));
      const response = await addComplainApi(mobileno, complain);
      dispatch(completeActionWithSuccess(HelpActionTypes.ADD_COMPLAIN, response));
      dispatch(showMessage(response.ErrorMessage));
    } catch (error) {
      dispatch(completeActionWithError(HelpActionTypes.ADD_COMPLAIN, error));
    }
  };
}

export const fetchStateCityMapping = () => {
  return async function (dispatch) {
    try {
      dispatch(startAction(HelpActionTypes.FETCH_STATE_CITY_MAPPING));
      const response = await fetchStateCityMappingApi();
      dispatch(completeActionWithSuccess(HelpActionTypes.FETCH_STATE_CITY_MAPPING, response.StateTypeDetails));
    } catch (error) {
      dispatch(completeActionWithError(HelpActionTypes.FETCH_STATE_CITY_MAPPING, error));
    }
  };
}

export const fetchBUCategory = () => {
  return async function (dispatch) {
    try {
      dispatch(startAction(HelpActionTypes.FETCH_BU_CATEGORIES));
      const response = await fetchBUCategoryApi();
      try {
        dispatch(completeActionWithSuccess(HelpActionTypes.FETCH_BU_CATEGORIES, response.Response.BUCategoryDetails));
      } catch(error) {
        dispatch(completeActionWithSuccess(HelpActionTypes.FETCH_BU_CATEGORIES, []));
      }
    } catch (error) {
      dispatch(completeActionWithError(HelpActionTypes.FETCH_BU_CATEGORIES, error));
    }
  };
}

export const fetchAppVersion = () => {
  return async function (dispatch) {
    try {
      /*dispatch(startAction(HelpActionTypes.FETCH_APP_VERSION));*/
      const response = await fetchAppVersionApi();
      dispatch(completeActionWithSuccess(HelpActionTypes.FETCH_APP_VERSION, response));
    } catch (error) {
      dispatch(completeActionWithError(HelpActionTypes.FETCH_APP_VERSION, error));
    }
  };
}

export const resetAppVersion = () => {
  return async function (dispatch) {
    dispatch(completeActionWithSuccess(HelpActionTypes.RESET_APP_VERSION));
  };
}
