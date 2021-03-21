import { axiosWrapper } from '../_helpers';
import { accountService } from '../_services';

// read from .env files
const config = { apiUrl: process.env.REACT_APP_API };
const baseUrl = `${config.apiUrl}/api`;

const createCharge = (params: any) => {
  const user = accountService.userValue;
  const accountId = user && user.id ? user.id : 1;

  const body = {
    accountId
  };

  // merge params
  const allParams = { ...params, ...body };
  return axiosWrapper.postMultipartFormData(`${baseUrl}/charges/createcharge`, allParams);
};

const createPaymentIntent = (options: any) => {
  return window
    .fetch(`${baseUrl}/charges/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return null;
    })
    .then((data) => {
      if (!data || data.error) {
        console.log('API error:', { data });
        throw new Error('PaymentIntent API Error');
      } else {
        return data.client_secret;
      }
    });
};

const getProductDetails = (options: any) => {
  return window
    .fetch(`${baseUrl}/charges/product-details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return null;
    })
    .then((data) => {
      if (!data || data.error) {
        console.log('API error:', { data });
        throw Error('API Error');
      } else {
        return data;
      }
    });
};

const getPublicStripeKey = (options: any) => {
  return window
    .fetch(`${baseUrl}/charges/public-key`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return null;
    })
    .then((data) => {
      if (!data || data.error) {
        console.log('API error:', { data });
        throw Error('API Error');
      } else {
        return data.publicKey;
      }
    });
};

export const chargeService = {
  createCharge,
  createPaymentIntent,
  getPublicStripeKey,
  getProductDetails
};
