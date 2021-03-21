import { fetchWrapper } from '../_helpers';
import { axiosWrapper } from '../_helpers';
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
  getEditionsByQuery,
  getEditionsByAccountId,
  getEditionById,
  getEditionIsEditable,
  createEdition,
  updateEdition,
  deleteEdition,
  getVolumeById,
  getVolumesByEditionId,
  getPersons,
  createPerson,
  getWalletsByPersonId,
  getWalletById,
  createWallet
};

function getTags() {
  return fetchWrapper.get(`${baseUrl}/tags`);
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

  return fetchWrapper.get(`${baseUrl}/collections/${accountId}`);
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
  return fetchWrapper.get(`${baseUrl}/editions`);
}

function getEditionsByAccountId() {
  const user = accountService.userValue;
  if (user && user.id) {
    return fetchWrapper.get(`${baseUrl}/editions/${user.id}`);
  }
  return Promise.reject('not logged in');
}

function getEditionsByQuery(query: string) {
  return fetchWrapper.get(`${baseUrl}/editions/${query}`);
}

function getEditionById(id: number) {
  return fetchWrapper.get(`${baseUrl}/edition/${id}`);
}

function getEditionIsEditable(id: number) {
  return fetchWrapper.get(`${baseUrl}/edition/iseditable/${id}`);
}

function createEdition(params: any) {
  const user = accountService.userValue;
  const accountId = user && user.id ? user.id : 1;

  const body = {
    accountId,
    languageCode: user && user.languageCode ? user.languageCode : 'no-NO',
    currencyUniqueId: params.currencyUniqueId ? params.currencyUniqueId : 'NFY',
    tagIds: params.tags.map((a: any) => a.value),
    collectionId: params.collection ? params.collection.value : ''
  };

  // delete params that should not be included in the post
  delete params['tags'];
  delete params['collection'];

  // merge params
  const allParams = { ...params, ...body };
  return axiosWrapper.postMultipartFormData(`${baseUrl}/edition`, allParams);
}

function updateEdition(id: string, params: any) {
  const user = accountService.userValue;
  const accountId = user && user.id ? user.id : 1;

  const body = {
    accountId,
    languageCode: user && user.languageCode ? user.languageCode : 'no-NO',
    currencyUniqueId: params.currencyUniqueId ? params.currencyUniqueId : 'NFY',
    tagIds: params.tags.map((a: any) => a.value),
    collectionId: params.collection ? params.collection.value : ''
  };

  // delete params that should not be included in the post
  delete params['tags'];
  delete params['collection'];

  // merge params
  const allParams = { ...params, ...body };

  return fetchWrapper.put(`${baseUrl}/edition/${id}`, allParams).then((edition) => {
    return edition;
  });
}

function deleteEdition(id: number) {
  const user = accountService.userValue;
  if (user && user.id) {
    return fetchWrapper.delete(`${baseUrl}/edition/delete/${id}`);
  }
  return Promise.reject('not logged in');
}

function getVolumesByEditionId(editionId: number) {
  return fetchWrapper.get(`${baseUrl}/volumes/${editionId}`);
}

function getVolumeById(id: number) {
  return fetchWrapper.get(`${baseUrl}/volume/${id}`);
}

function getPersons() {
  const user = accountService.userValue;
  const accountId = user && user.id ? user.id : 1;

  return fetchWrapper.get(`${baseUrl}/persons/${accountId}`);
}

function createPerson(params: any) {
  const user = accountService.userValue;

  const body = {
    accountId: user.id
  };
  // merge params
  const allParams = { ...params, ...body };
  return fetchWrapper.post(`${baseUrl}/person`, allParams);
}

function getWalletsByPersonId(personId: number) {
  return fetchWrapper.get(`${baseUrl}/wallets/${personId}`);
}

function getWalletById(id: number) {
  return fetchWrapper.get(`${baseUrl}/wallet/${id}`);
}

function createWallet(params: any) {
  const user = accountService.userValue;

  const body = {
    accountId: user.id
  };
  // merge params
  const allParams = { ...params, ...body };
  return fetchWrapper.post(`${baseUrl}/wallet`, allParams);
}