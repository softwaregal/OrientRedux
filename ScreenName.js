/**
 * @class       : ScreenName
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 02, 2019 10:11:57 IST
 * @description : ScreenName
 */

import AuthScreens from './screens/auth/ScreenName';
import DashboardScreens from './screens/app/dashboard/ScreenName';

const screenNames = {
  Navigator: {
    AUTH: 'NAVIGATOR_AUTH',
    APP: 'NAVIGATOR_APP',
    SPLASH: 'SPLASH',
  },
  Auth: AuthScreens,
  Dashboard: DashboardScreens,
};

export default screenNames;
