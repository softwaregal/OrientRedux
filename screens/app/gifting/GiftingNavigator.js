/**
 * @class       : GiftingNavigator
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Thursday Jan 24, 2019 14:38:53 IST
 * @description : GiftingNavigator
 */

import GiftingHome from './GiftingHome';
import GiftingStatus from './GiftingStatus';
import GiftDelivery from './GiftDelivery';
import GiftDeliveryStatus from './GiftDeliveryStatus';
import GiftingHomeRetailer from './GiftingHomeRetailer';

import ScreenName from './ScreenName';

export const giftingScreens = {
  [ScreenName.GIFTING_HOME]: {
    screen: GiftingHome,
    params : {
      title: 'Gifting',
    }
  },
  [ScreenName.GIFTING_STATUS]: {
    screen: GiftingStatus,
    params : {
      title: 'Gifting Status',
    }
  },
  [ScreenName.GIFT_DELIVERY]: {
    screen: GiftDelivery,
    params : {
      title: 'Gift Delivery',
    }
  },
  [ScreenName.GIFT_DELIVERY_STATUS]: {
    screen: GiftDeliveryStatus,
    params : {
      title: 'Gift Delivery Status',
    }
  },
  [ScreenName.GIFTING_HOME_RETAILER]: {
    screen: GiftingHomeRetailer,
    params : {
      title: 'Gifting',
    }
  },
};
