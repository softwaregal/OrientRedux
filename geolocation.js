/**
 * @class       : geolocation
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Wednesday Jan 30, 2019 14:05:10 IST
 * @description : geolocation
 */
import {
    PermissionsAndroid,
    Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const requestPermission = async () => {
  if (Platform.OS === 'ios' ||
    (Platform.OS === 'android' && Platform.Version < 23)) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (hasPermission) return true;

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    throw new Error('Location permission denied by user.');
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    throw new Error('Location permission revoked by user.');
  }

  return false;
}

export const getLocation = async (config, onStart, onSuccess, onError) => {
  if (typeof config === 'function') {
    onError = onSuccess;
    onSuccess = onStart
    onStart = config;
    config = {};
  }
  const hasPermission = await requestPermission();

  if (!hasPermission) return;

  onStart();

  Geolocation.getCurrentPosition(
    onSuccess,
    onError,
    {
      enableHighAccuracy: false,
      timeout: config.timeout || 15000,
      maximumAge: config.maximumAge || 10000,
      distanceFilter: config.distanceFilter || 50,
    }
  );
}
