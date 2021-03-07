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

function handleResponse(response: any) {
  return response.text().then((text: string) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status) && accountService.userValue) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        accountService.logout();
      }

      // extract error message and convert to string
      const error =
        (data && data.errors && data.errors.map((a: any) => a.description).join(' ')) || // typical 400 errors
        (data && data.title) ||
        (data && data.message) ||
        response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function get(url: string) {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: authHeader(url)
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function post(url: string, body: any) {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    credentials: 'include',
    body: JSON.stringify(body)
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function put(url: string, body: any) {
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    body: JSON.stringify(body)
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url: string) {
  const requestOptions: RequestInit = {
    method: 'DELETE',
    headers: authHeader(url)
  };
  return fetch(url, requestOptions).then(handleResponse);
}

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete
};
