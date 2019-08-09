/**
 * @class       : SignUpSelector
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 16, 2019 12:52:59 IST
 * @description : SignUpSelector
 */

export const getSignUpInstructions = state => state.signup.signUpInstruction;
export const getStateCityMapping = state => state.signup.stateCityMapping;
export const getSignUpProfile = state => state.signup.profile;
export const getBUCategories = state => state.signup.BUCategories;
export const getSignUpStep = state => state.signup.signUpStep;
export const getTermsAndConditions = state => state.signup.TermandCondition;
export const getBankNameList = state => state.signup.bankDetail;
export const getBankDetailStatus = state => state.signup.bankDetailStatus;
export const getUserDashData = state => state.signup.userDashData;
