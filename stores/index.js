/**
 * @class       : index
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 13:57:49 IST
 * @description : index
 */


import { combineReducers } from 'redux';

import UserStore from './UserStore';
import ApiStore from './ApiStore';
import HelpStore from './HelpStore';
import QRCodeStore from './QRCodeStore';
import SignUpStore from './SignUpStore';
import NotificationStore from './NotificationStore';
import GiftingStore from './GiftingStore';


export default combineReducers({
  users: UserStore,
  api: ApiStore,
  help: HelpStore,
  qrcode: QRCodeStore,
  signup: SignUpStore,
  notification: NotificationStore,
  gifting: GiftingStore
});
