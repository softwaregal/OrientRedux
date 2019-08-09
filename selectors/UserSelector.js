/**
 * @class       : UserSelector
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 13:41:59 IST
 * @description : UserSelector
 */

export const getUserProfile = state => state.users.me;
export const getProfileDetail = state => state.users.profileDetail;
export const isUsersLoading = state => state.users.isLoading;
export const getUserPrivilegeMap = state => state.users.privilegeMap;
