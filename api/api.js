/**
 * @class       : api
 * @author      : vikash (vikash@kritikal-Latitude-3480)
 * @created     : Monday Jan 07, 2019 12:10:56 IST
 * @description : api
 */

import axios from 'axios';

const config = require('./config.json');
const mockData  = require('./mockData.json');

class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const axiosInstance = axios.create({
  baseURL: config.baseURL,
});

axiosInstance.interceptors.request.use(function (config) {
  config.auth = {
    username: 'Novatis',
    password: '!!Novatis!!',
  };
  config.headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json; charset=utf-8',
  };
  return config;
}, function (error) {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
  const { ErrorCode, ErrorMessage, ...rest } = response.data;

  if (ErrorCode != 0) {
    return Promise.reject(new ApiError(ErrorMessage, parseInt(ErrorCode)));
  }
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export const postRequest = async (path, body = {}) => {
  var complete = false;
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  let elapsed = 0;
  const interval = 100;

  const timeoutTimer = setInterval(() => {
    if (!complete && elapsed >= config.requestTimeout) {
      clearInterval(timeoutTimer);
      source.cancel('Request timed out');
    } else {
      elapsed += interval;
    }
  }, interval);
  try {
    const response = await axiosInstance.post(path,
      body, {
        cancelToken: source.token
      });
    return response;
  } catch(error) {
    if (axios.isCancel(error)) {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    complete = true;
    if (timeoutTimer) {
      clearInterval(timeoutTimer);
    }
  }
}

const instance = {
  post: postRequest
};

export { instance as apiClient };
