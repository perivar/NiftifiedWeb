import { BehaviorSubject } from 'rxjs';

// read from .env files
const config = { apiUrl: process.env.REACT_APP_API };

import { fetchWrapper, history } from '../_helpers';

const userSubject: any = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/accounts`;

export const accountService = {
  login,
  logout,
  refreshToken,
  register,
  verifyEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  user: userSubject.asObservable(),
  get userValue(): any {
    return userSubject.value;
  }
};

function login(email: string, password: string) {
  return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password }).then((user) => {
    // publish user to subscribers and start timer to refresh token
    userSubject.next(user);
    startRefreshTokenTimer();
    return user;
  });
}

function logout() {
  // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
  fetchWrapper.post(`${baseUrl}/revoke-token`, {});
  stopRefreshTokenTimer();
  userSubject.next(null);
  history.push('/account/login');
}

function refreshToken() {
  return fetchWrapper
    .post(`${baseUrl}/refresh-token`, {})
    .then((user) => {
      // publish user to subscribers and start timer to refresh token
      userSubject.next(user);
      startRefreshTokenTimer();
      return user;
    })
    .catch(function (error) {
      // just log the error
      console.log(error);
    });
}

function register(params: any) {
  return fetchWrapper.post(`${baseUrl}/register`, params);
}

function verifyEmail(token: null | string | string[]) {
  return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

function forgotPassword(email: string) {
  return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

function validateResetToken(token: null | string | string[]) {
  return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}

function resetPassword({
  token,
  password,
  confirmPassword
}: {
  token: null | string | string[];
  password: string;
  confirmPassword: string;
}) {
  return fetchWrapper.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
}

function getAll() {
  return fetchWrapper.get(baseUrl);
}

function getById(id: string) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params: any) {
  return fetchWrapper.post(baseUrl, params);
}

function update(id: string, params: any) {
  return fetchWrapper.put(`${baseUrl}/${id}`, params).then((user) => {
    // update stored user if the logged in user updated their own record
    if (user.id === userSubject.value.id) {
      // publish updated user to subscribers
      user = { ...userSubject.value, ...user };
      userSubject.next(user);
    }
    return user;
  });
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id: string) {
  return fetchWrapper.delete(`${baseUrl}/${id}`).then((x) => {
    // auto logout if the logged in user deleted their own record
    if (id === userSubject.value.id) {
      logout();
    }
    return x;
  });
}

// helper functions

let refreshTokenTimeout: NodeJS.Timeout;

function startRefreshTokenTimer() {
  // parse json object from base64 encoded jwt token
  const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split('.')[1]));

  // set a timeout to refresh the token a minute before it expires
  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() - 60 * 1000;
  refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
  clearTimeout(refreshTokenTimeout);
}
