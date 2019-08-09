/**
 * @class       : utils
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 10, 2019 11:15:41 IST
 * @description : utils
 */

import { Platform } from 'react-native';
import { GiftingStatus } from './constants';
import { Colors } from './res';

export const isTruthy = str => {
  if (!str) return false;
  return (
    str.toUpperCase() == "YES"
    || str.toUpperCase() == "Y"
  )
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const toDateString = date => {
  if (typeof date === 'string') {
    return date;
  }
  let dateVal = date.getDate();
  if(dateVal < 10)
    return `${'0' + date.getDate()}-${getShortMonthName(date)}-${getYear(date)}`;

  return `${date.getDate()}-${getShortMonthName(date)}-${getYear(date)}`;
}

export const fromDateString = str => {
  if (!str || str.length === 0) {
    return null;
  }
  try {
    let values = str.split('-');
    let monthIndex = monthNames.indexOf(values[1]);
    return new Date(values[2], monthIndex, values[0]);
  } catch (error) {
    return null;
  }
}

export const getShortMonthName = date => monthNames[date.getMonth()]
export const getYear = date => date.getFullYear()

export const isSalesExecutive = profile => profile.MemberType === 'M';
export const isRetailer       = profile => profile.MemberType === 'R';
export const isDistributor    = profile => profile.MemberType === 'D';
export const isNSH            = profile => profile.MemberType === 'E';
export const isRSM            = profile => profile.MemberType === 'Z';
export const isStateHead      = profile => profile.MemberType === 'B';

export const SignUpStep = {
  PROFILE_DETAIL: 'PROFILE_DETAIL',
  VERIFY_OTP: 'VERIFY_OTP',
  SIGNUP_COMPLETE: 'SIGNUP_COMPLETE',
}

export const getGiftingStatusString = status => {
  switch(status) {
    case GiftingStatus.PENDING: return 'Pending';
    case GiftingStatus.REJECTED: return 'Rejected';
    case GiftingStatus.APPROVED: return 'Approved';
    case GiftingStatus.DELIVERED: return 'Delivered';
    case GiftingStatus.DISPATCHED: return 'With SE';
    case GiftingStatus.ALL: return 'All';
    default: 'Unknwon Status';
  }
};

export const elevation = length => {
  return Platform.select({
    android: { elevation: length },
    ios: {
      shadowOffset: { width: 0, height: 0 },
      shadowColor: Colors.LIGHT_GREY,
      shadowOpacity: 1,
      shadowRadius: length,
      zIndex:999
    }
  });
}
