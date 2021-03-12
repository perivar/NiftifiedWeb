import { fetchWrapper } from '../_helpers';
import { accountService } from '../_services';

// read from .env files
const config = { apiUrl: process.env.REACT_APP_API };

const baseUrl = `${config.apiUrl}/api`;

export const niftyService = {
  getTags,
  createTag,
  getCollections,
  createCollection,
  getEditions,
  createEdition
};

function getTags() {
  return fetchWrapper.get(`${baseUrl}/tag`);
}

function createTag(value: string, description?: string) {
  const user = accountService.userValue;

  const body = {
    languageCode: user && user.languageCode ? user.languageCode : 'no-NO',
    name: value,
    description: description ? description : ''
  };

  return fetchWrapper.post(`${baseUrl}/tag`, body);
}

function getCollections() {
  const user = accountService.userValue;
  const accountId = user && user.id ? user.id : 1;

  return fetchWrapper.get(`${baseUrl}/collection/${accountId}`);
}

function createCollection(value: string, description?: string) {
  const user = accountService.userValue;

  const body = {
    languageCode: user && user.languageCode ? user.languageCode : 'no-NO',
    accountId: user && user.id ? user.id : 1,
    name: value,
    description: description ? description : '',
    year: new Date().getFullYear()
  };

  return fetchWrapper.post(`${baseUrl}/collection`, body);
}

function getEditions() {
  return fetchWrapper.get(`${baseUrl}/edition`);
}

function createEdition(params: any) {
  const user = accountService.userValue;

  const body = {
    languageCode: user && user.languageCode ? user.languageCode : 'no-NO',
    description: params.description ? params.description : ''
  };
  // merge params
  const allParams = { ...params, ...body };
  return fetchWrapper.post(`${baseUrl}/edition`, allParams);
}
