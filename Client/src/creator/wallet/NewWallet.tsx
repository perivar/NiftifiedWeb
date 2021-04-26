import React, { useEffect } from 'react';
import * as bip39 from 'bip39';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../../_services';
import FormikSelect from '../../_common/select/FormikSelect';
import FocusError from '../../_common/FocusError';
import * as Scroll from 'react-scroll';
// import { Link } from 'react-router-dom';
// import { makeWallet } from '../wallet/GenerateWallet';
import { encrypt } from '../wallet/webcrypto';
import { Status, statusOptions, WalletType } from '../../_common/enums';
import CryptoUtil from '../../_common/crypto/util';

const scroll = Scroll.animateScroll;

export interface FormValues {
  alias: string;
  isAnonymous: boolean;
  accountId: number;
  status: Status;
  // type: CreatorType; // creator, co-creator?
  isConfirmed: boolean;

  // wallet info
  name: string;
  walletType: WalletType;
  privateKeyEncrypted: string;
  privateKeyWIFEncrypted: string;
  privateMnemonicEncrypted: string;
  publicAddress: string;
  publicKey: string;
  publicKeyHash: string;
}

export const NewWalletForm = ({ history }: { history: any }) => {
  const initialValues: FormValues = {
    alias: '',
    isAnonymous: false,
    accountId: 0,
    status: Status.Pending,
    // type: CreatorType.Creator,
    isConfirmed: false,

    // wallet info
    name: 'wallet',
    walletType: WalletType.NiftyCoin,
    privateKeyEncrypted: '',
    privateKeyWIFEncrypted: '',
    privateMnemonicEncrypted: '',
    publicAddress: '',
    publicKey: '',
    publicKeyHash: ''
  };

  const validationSchema = Yup.object().shape({
    alias: Yup.string().required('Alias is required'),
    isAnonymous: Yup.boolean().required('Please choose wheter you want to be anonymous')
  });

  const onSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    // alert(JSON.stringify(values, null, 2));
    formikHelpers.setSubmitting(true);

    try {
      const importMnemonic = ''; // PIN: TODO allow the user to import a mnemonic
      const NETWORK = process.env.REACT_APP_NETWORK;
      const network = CryptoUtil.getNetwork(NETWORK);

      // create 128 bit BIP39 mnemonic
      const mnemonic = importMnemonic ? importMnemonic : bip39.generateMnemonic();

      if (!mnemonic || mnemonic === '') {
        console.log('Error mnemonic is missing!');
        return undefined;
      }

      const firstExternalAddress = await CryptoUtil.changeAddressFromMnemonic(mnemonic, network);

      const segwitAddress = CryptoUtil.toSegWitAddress(firstExternalAddress, network);
      const legacyAddress = CryptoUtil.toLegacyAddress(firstExternalAddress, network);
      const privateKeyWIF = firstExternalAddress.toWIF();
      const publicKey = CryptoUtil.toPublicKey(firstExternalAddress);
      const privateKey = CryptoUtil.toPrivateKeyFromWIF(privateKeyWIF, network);

      // TODO - do not save the private key in production
      // only while debugging
      values.publicKey = publicKey;
      // values.publicKeyHash = publicKeyHash;
      values.publicAddress = legacyAddress;
      values.privateKeyEncrypted = privateKey;
      values.privateKeyWIFEncrypted = privateKeyWIF;
      values.privateMnemonicEncrypted = mnemonic;

      const encryptedData = await encrypt(privateKeyWIF);
      // values.privateKeyWIFEncrypted = encryptedData;

      const response = await niftyService.createWallet(values);
      formikHelpers.setSubmitting(false);
      alertService.success('Successfully created a new wallet!', {
        keepAfterRouteChange: true
      });
      history.push('/creator/profile');
    } catch (error) {
      formikHelpers.setSubmitting(false);
      alertService.error(error, { autoClose: false });
      scroll.scrollToTop();
    }
  };

  return (
    <>
      <div className="container-fluid">
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          {({ values, errors, touched, isSubmitting }) => (
            <Form noValidate>
              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="name">Alias</label>
                    <Field
                      id="alias"
                      name="alias"
                      type="text"
                      className={`form-control${errors.alias && touched.alias ? ' is-invalid' : ''}`}
                    />
                    <small id="nameHelpBlock" className="form-text text-muted">
                      Please enter a name or an alias.
                    </small>
                    <ErrorMessage name="alias" component="div" className="invalid-feedback" />
                  </div>

                  <div className="form-group">
                    <div className="form-check">
                      <Field className="form-check-input" type="checkbox" name="isAnonymous" />
                      <label className="form-check-label" htmlFor="isAnonymous">
                        Anonymous
                      </label>
                      <ErrorMessage name="isAnonymous" component="div" className="invalid-feedback" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <Field
                      id="status"
                      name="status"
                      type="text"
                      options={statusOptions}
                      component={FormikSelect}
                      placeholder="Select Status..."
                      isMulti={false}
                    />
                    <ErrorMessage name="status" component="div" className="invalid-feedback  show-block" />
                  </div>

                  {/* <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <Field
                      id="type"
                      name="type"
                      type="text"
                      options={typeOptions}
                      component={CustomSelect}
                      placeholder="Select Type..."
                      isMulti={false}
                    />
                    <ErrorMessage name="type" component="div" className="invalid-feedback  show-block" />
                  </div> */}
                </div>
              </div>
              <div className="form-group">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  Save Wallet
                </button>
              </div>
              <FocusError />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
