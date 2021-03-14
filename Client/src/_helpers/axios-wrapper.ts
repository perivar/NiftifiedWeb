import axios from 'axios';

// read from .env files
const config = { apiUrl: process.env.REACT_APP_API };

import { accountService } from '../_services';

// helper functions

function authHeader(url: string): HeadersInit {
  // return auth header with jwt if user is logged in and request is to the api url
  const user = accountService.userValue;
  const isLoggedIn = user && user.jwtToken;
  const isApiUrl = config.apiUrl && url.startsWith(config.apiUrl);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.jwtToken}` };
  }
  return {};
}

function handleAxiosError(error: any) {
  let errorResponse;
  if (error.response && error.response.data) {
    // extract error message and convert to string
    const { data } = error.response;
    errorResponse =
      (data && data.errors && Object.values(data.errors).join(' ')) || // typical 400 errors
      (data && data.title) ||
      (data && data.message) ||
      error.response.statusText;

    // JSON stringify if you need the json and use it later
  } else if (error.request) {
    // TO Handle the default error response for Network failure or 404 etc.,
    errorResponse = error.request.message || error.request.statusText;
  } else {
    errorResponse = error.message;
  }

  return Promise.reject(errorResponse);
}

function handleAxiosSuccess(res: any) {
  return res.data;
}

// convert object to formdata format where arrays are added as multiple values
const getFormData = (object: any, includeBrackets = false) =>
  Object.entries(object).reduce((fd: any, [key, val]: any) => {
    if (Array.isArray(val)) {
      if (includeBrackets) {
        // if the API need 'name[i] = value' for each value
        val.forEach((v, i) => fd.append(`${key}[${i}]`, v));
      } else {
        // The dotnet API does not need the bracket format above
        val.forEach((v) => fd.append(`${key}`, v));
      }
    } else {
      fd.append(key, val);
    }
    return fd;
  }, new FormData());

function postMultipartFormData(url: string, data: any) {
  // convert the object data to form data
  const formData = getFormData(data);

  const config = {
    headers: {
      ...authHeader(url),
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  };

  return axios.post(url, formData, config).then(handleAxiosSuccess).catch(handleAxiosError);
}

export const axiosWrapper = {
  postMultipartFormData
};
