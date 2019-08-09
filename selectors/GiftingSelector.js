/**
 * @class       : GiftingSelector
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Friday Jan 25, 2019 12:00:25 IST
 * @description : GiftingSelector
 */

import { GiftingStatus } from '../constants';
import { isSalesExecutive, isNSH, isRSM, isStateHead, isDistributor, isRetailer } from '../utils';

export const getAllSchemes = (state, profile) => {
  const schemes = state.gifting.schemes;

  if (!schemes) {
    return null;
  }
  return schemes.map(scheme => {
    const { SchemeId, SchemeName, TotalCount } = scheme;
    const schemeObj = { SchemeName, SchemeId, TotalCount: parseInt(TotalCount) };
    const options = [];
    if (scheme.PendingCount || scheme.PendingCount === 0) {
      options.push({ label: 'Eligible Retailers', value: parseInt(scheme.PendingCount), Status: GiftingStatus.PENDING });
    }
    
    if (profile && isDistributor(profile)) {
      if (scheme.ApprovedCount || scheme.ApprovedCount === 0) {
        options.push({ label: 'Approved', value: parseInt(scheme.ApprovedCount), Status: GiftingStatus.APPROVED });
      }
      if (scheme.RejectedCount || scheme.RejectedCount === 0) {
        options.push({ label: 'Rejected', value: parseInt(scheme.RejectedCount), Status: GiftingStatus.REJECTED });
      }
    }

    if (scheme.DeliveredCount || scheme.DeliveredCount === 0) {
      options.push({ label: 'Delivered', value: parseInt(scheme.DeliveredCount), Status: GiftingStatus.DELIVERED });
    }

    if (profile && !isRetailer(profile)) {
      if(scheme.DispatchedCount || scheme.DispatchedCount === 0){
        options.push({ label: 'With SE', value: parseInt(scheme.DispatchedCount), Status: GiftingStatus.DISPATCHED });
      }
    }

    schemeObj.options = options;
    return schemeObj;
  });
}

export const getGiftingDetails = (state, schemeId, status) => {
  const { giftingDetails } = state.gifting;

  if (!giftingDetails) {
    return null;
  }
  return giftingDetails.filter(detail => {
    return (!schemeId || detail.SchemeId === schemeId) && (!status || detail.Status === status);
  });
}

export const getRatingDetails = state => {
  const ratingDetails  = state.gifting.retailerGiftingDetails;

  if (!ratingDetails || ratingDetails.length === 0) {
    return [];
  }
  return ratingDetails;
  }

export const getHappyCodeApprovedStatus = state => state.gifting.happyCodeApproved;
export const getUpdateGiftStatus = state => state.gifting.updateGiftStatus;
export const getUserMapping = state => state.gifting.userMapping;

