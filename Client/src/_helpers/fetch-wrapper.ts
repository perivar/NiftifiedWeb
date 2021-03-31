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
  return handleResponseStatusAndContentType(response).then((data: any) => {
    if (!response.ok) {
      // extract error message and convert to string
      const error =
        (data && data.errors && Object.values(data.errors).join(' ')) || // typical 400 errors
        (data && data.title) ||
        (data && data.message) ||
        response.statusText;
      throw new Error(error);
    }

    return data;
  });
}

function handleResponseStatusAndContentType(response: any) {
  const contentType = response.headers.get('content-type')!;

  if ([401, 403].includes(response.status) && accountService.userValue) {
    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    accountService.logout();
    throw new Error('Request was not authorized.');
  }

  if (contentType === null) {
    return Promise.resolve(null);
  } else if (contentType.startsWith('application/json')) {
    return response.json();
  } else if (contentType.startsWith('text/plain')) {
    return response.text();
  }
  throw new Error(`Unsupported response content-type: ${contentType}`);
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
