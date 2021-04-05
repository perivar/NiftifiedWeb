import React, { memo, useState } from 'react';
import { Form, Field, ErrorMessage, FormikProps, withFormik } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../../_services';
import FormikSelect from '../../_common/select/FormikSelect';
import FocusError from '../../_common/FocusError';
import * as Scroll from 'react-scroll';
import { Link } from 'react-router-dom';
import { WalletType, walletTypeOptions } from '../../_common/enums';
import { getPublicKey, HASH160, getPublicAddress, getPrivateKeyWIF, getPrivateKey } from './GenerateWallet';

const scroll = Scroll.animateScroll;

interface FormValues {
  name: string;
  walletType: WalletType | null;
  publicKey: string;
  publicKeyHash: string;
  publicAddress: string;
  privateKeyEncrypted: string;
  privateKeyWIFEncrypted: string;
  personId: any;
}

const validationSchema = Yup.object().shape(
  {
    name: Yup.string().required('A unique name is required'),
    walletType: Yup.mixed().required('Wallet Type is required'),
    publicKey: Yup.string().required('A public key is required'),
    publicKeyHash: Yup.string().required('A public key hash is required'),
    publicAddress: Yup.string().required('A public address is required'),
    privateKeyEncrypted: Yup.string().when('privateKeyWIFEncrypted', {
      is: (privateKeyWIFEncrypted: string) => !privateKeyWIFEncrypted || privateKeyWIFEncrypted.length === 0,
      then: Yup.string().required('One format of a private key is required'),
      otherwise: Yup.string()
    }),
    privateKeyWIFEncrypted: Yup.string().when('privateKeyEncrypted', {
      is: (privateKeyEncrypted: string) => !privateKeyEncrypted || privateKeyEncrypted.length === 0,
      then: Yup.string().required('One format of a private key is required'),
      otherwise: Yup.string()
    })
  },
  // Required when checking more than one field to avoid cyclic errors
  [['privateKeyEncrypted', 'privateKeyWIFEncrypted']]
);

// check https://medium.com/fotontech/forms-with-formik-typescript-d8154cc24f8a
// and https://stackoverflow.com/questions/65001954/formik-form-not-submitting-from-modal-component
const InnerForm = (props: any & FormikProps<FormValues>) => {
  const { setFieldTouched, setFieldError, setFieldValue, values, errors, touched, submitForm, isSubmitting } = props;
  const { match } = props;
  const { id } = match.params;

  const handleOnBlur = () => {
    try {
      let privateKey = '';
      let privateKeyWIF = '';
      if (values.privateKeyWIFEncrypted !== '') {
        privateKeyWIF = values.privateKeyWIFEncrypted;
        privateKey = getPrivateKey(privateKeyWIF);
      } else if (values.privateKeyEncrypted !== '') {
        privateKey = values.privateKeyEncrypted;
        privateKeyWIF = getPrivateKeyWIF(privateKey);
      }

      if (privateKey !== '' && privateKeyWIF !== '') {
        // set WIF
        setFieldValue('privateKeyWIFEncrypted', privateKeyWIF);
        setFieldTouched('privateKeyWIFEncrypted', true);
        setFieldError('privateKeyWIFEncrypted', undefined);

        // set hex
        setFieldValue('privateKeyEncrypted', privateKey);
        setFieldTouched('privateKeyEncrypted', true);
        setFieldError('privateKeyEncrypted', undefined);

        // generate public key from private
        const publicKey = getPublicKey(privateKey);
        setFieldValue('publicKey', publicKey);
        setFieldTouched('publicKey', true);
        setFieldError('publicKey', undefined);

        // generate public key hash
        const publicKeyHash = HASH160(publicKey);
        setFieldValue('publicKeyHash', publicKeyHash.toString('hex'));
        setFieldTouched('publicKeyHash', true);
        setFieldError('publicKeyHash', undefined);

        // generate public address
        const publicAddress = getPublicAddress(publicKeyHash.toString('hex'));
        setFieldValue('publicAddress', publicAddress);
        setFieldTouched('publicAddress', true);
        setFieldError('publicAddress', undefined);
      }
    } catch (error) {
      console.log(`failed: ${error}`);
    }
  };

  return (
    <>
      <Link to={`/creator/wallets/${id}`} className="btn btn-primary">
        Wallets
      </Link>
      <div className="container mt-4">
        <Form>
          <div className="form-row">
            <div className="col">
              <h4>
                <strong>Add new Wallet - please fill inn here</strong>
              </h4>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                  onBlur={handleOnBlur}
                />
                <small id="nameHelpBlock" className="form-text text-muted">
                  To help you find the right wallet, please choose a unique name
                </small>
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </div>

              <div className="form-group">
                <label htmlFor="walletType">Wallet Type</label>
                <Field
                  id="walletType"
                  name="walletType"
                  type="text"
                  options={walletTypeOptions}
                  component={FormikSelect}
                  placeholder="Select Type..."
                  isMulti={false}
                />
                <ErrorMessage name="walletType" component="div" className="invalid-feedback show-block" />
              </div>

              <div className="form-group">
                <label htmlFor="privateKeyWIFEncrypted">Private Key WIF</label>
                <Field
                  id="privateKeyWIFEncrypted"
                  name="privateKeyWIFEncrypted"
                  type="text"
                  className={`form-control${
                    errors.privateKeyWIFEncrypted && touched.privateKeyWIFEncrypted ? ' is-invalid' : ''
                  }`}
                  onBlur={handleOnBlur}
                />
                <small id="privateKeyWIFEncryptedHelpBlock" className="form-text text-muted">
                  Private Key in Wallet Import Format (WIF) which can have 51 or 52 characters in it.
                </small>
                <ErrorMessage name="privateKeyWIFEncrypted" component="div" className="invalid-feedback" />
              </div>
              <h4> --- OR ---</h4>
              <div className="form-group">
                <label htmlFor="privateKeyEncrypted">Private Key in hexadecimal format</label>
                <Field
                  id="privateKeyEncrypted"
                  name="privateKeyEncrypted"
                  type="text"
                  className={`form-control${
                    errors.privateKeyEncrypted && touched.privateKeyEncrypted ? ' is-invalid' : ''
                  }`}
                  onBlur={handleOnBlur}
                />
                <small id="privateKeyEncryptedHelpBlock" className="form-text text-muted">
                  Private Key in hexadecimal format: (64 characters [0-9A-F]).
                </small>
                <ErrorMessage name="privateKeyEncrypted" component="div" className="invalid-feedback" />
              </div>
              <h4>
                <strong>Calculated values</strong>
              </h4>
              <div className="form-group">
                <label htmlFor="publicAddress">Public Address</label>
                <Field
                  id="publicAddress"
                  name="publicAddress"
                  type="text"
                  className={`form-control${errors.publicAddress && touched.publicAddress ? ' is-invalid' : ''}`}
                  readonly
                />
                <small id="publicAddressHelpBlock" className="form-text text-muted">
                  Public address in XYZ format: (34 characters).
                </small>
                <ErrorMessage name="publicAddress" component="div" className="invalid-feedback" />
              </div>
              <div className="form-group">
                <label htmlFor="publicKeyHash">Public Key Hash</label>
                <Field
                  id="publicKeyHash"
                  name="publicKeyHash"
                  type="text"
                  className={`form-control${errors.publicKeyHash && touched.publicKeyHash ? ' is-invalid' : ''}`}
                  readonly
                />
                <small id="publicKeyHashHelpBlock" className="form-text text-muted">
                  RIPEMD160 ( SHA256(publickey) ) in hexadecimal format: (40 characters [0-9A-F])
                </small>
                <ErrorMessage name="publicKeyHash" component="div" className="invalid-feedback" />
              </div>
              <div className="form-group">
                <label htmlFor="publicKey">Public Key</label>
                <Field
                  id="publicKey"
                  name="publicKey"
                  as="textarea"
                  type="text"
                  className={`form-control${errors.publicKey && touched.publicKey ? ' is-invalid' : ''}`}
                  readonly
                />
                <small id="publicKeyHelpBlock" className="form-text text-muted">
                  Hexadecimal format: (130 characters [0-9A-F])
                </small>
                <ErrorMessage name="publicKey" component="div" className="invalid-feedback" />
              </div>
              <div className="form-group">
                <button type="button" disabled={isSubmitting} className="btn btn-primary" onClick={submitForm}>
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  Save Wallet
                </button>
                <Link to={`/creator/wallets/${id}`} className="ml-2 btn btn-secondary">
                  Cancel
                </Link>
              </div>
              <FocusError />
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

const initialValues: FormValues = {
  name: '',
  walletType: null,
  publicKey: '',
  publicKeyHash: '',
  publicAddress: '',
  privateKeyEncrypted: '',
  privateKeyWIFEncrypted: '',
  personId: 0
};

const enhanceWithFormik = withFormik<any, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema,
  handleSubmit: (values: FormValues, { props, setSubmitting }) => {
    const { history } = props;
    const { match } = props;
    const { id } = match.params;

    // set personId
    values.personId = id;

    try {
      niftyService
        .createWallet(values)
        .then(() => {
          setSubmitting(false);
          alertService.success('Successfully added a new wallet!', {
            keepAfterRouteChange: true
          });
          history.push('/creator/profile');
        })
        .catch((error) => {
          setSubmitting(false);
          alertService.error(error, { autoClose: false });
          scroll.scrollToTop();
        });
    } catch (error) {
      setSubmitting(false);
      alertService.error(error, { autoClose: false });
      scroll.scrollToTop();
    }
  }
});

export const NewWalletForm = enhanceWithFormik(memo(InnerForm));
