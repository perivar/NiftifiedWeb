/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { memo } from 'react';
import * as bip39 from 'bip39';
import { Modal } from 'react-bootstrap';
import { niftyService } from '../../_services';
import { Field, ErrorMessage, withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import FocusError from '../../_common/FocusError';
// import CustomSelect from '../../_common/select/CustomSelect';
import { Status, WalletType } from '../../_common/enums';
// import { makeWallet } from '../wallet/GenerateWallet';
import { encrypt } from '../wallet/webcrypto';
import CryptoUtil from '../../_common/crypto/util';

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

interface OtherProps {
  show: boolean;
  setShow: Function;
  onSuccess: Function;
  onFailure: Function;
}

const validationSchema = Yup.object().shape({
  alias: Yup.string().required('Alias is required'),
  salesCommissionShare: Yup.number().max(100, 'The share cannot be more than 100 (percent)')
});

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
  publicAddress: '',
  publicKey: '',
  publicKeyHash: '',
  privateMnemonicEncrypted: ''
};

// check https://medium.com/fotontech/forms-with-formik-typescript-d8154cc24f8a
// and https://stackoverflow.com/questions/65001954/formik-form-not-submitting-from-modal-component
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const { errors, touched, submitForm, isSubmitting } = props;
  const { show, setShow } = props;

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} autoFocus={false}>
      <Modal.Header closeButton>
        <Modal.Title>New Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="name">Alias</label>
              <Field
                id="alias"
                name="alias"
                type="text"
                autoFocus={true}
                className={`form-control${errors.alias && touched.alias ? ' is-invalid' : ''}`}
              />
              <small id="nameHelpBlock" className="form-text text-muted">
                Please enter a name or an alias to differentiate the wallets.
              </small>
              <ErrorMessage name="alias" component="div" className="invalid-feedback" />
            </div>
            <p>
              <strong>You are about to create a new NiftyCoin Crypto Wallet</strong>
            </p>
            <p>
              To protect the wallet (private keys) you will be asked to provide a pass phrase.
              <strong> Please make a note of this pass phrase</strong> since this is the <strong>ONLY</strong> way to
              ever get access to the wallet (private keys). Niftified.com does not have access to your private key!
            </p>
            <p className="text-danger">
              <i className="fas fa-exclamation-triangle"></i> If you forget this, you will <strong>NEVER</strong> get
              access to the wallet, and any commission income for this wallet will be lost <strong>FOREVER!</strong>
            </p>
            {/* <div className="form-group">
                <div className="form-check">
                  <Field className="form-check-input" type="checkbox" name="isAnonymous" />
                  <label className="form-check-label" htmlFor="isAnonymous">
                    Anonymous
                  </label>
                  <ErrorMessage name="isAnonymous" component="div" className="invalid-feedback" />
                </div>
              </div> */}

            {/* <div className="form-group">
                <label htmlFor="status">Status</label>
                <Field
                  id="status"
                  name="status"
                  type="text"
                  options={statusOptions}
                  component={CustomSelect}
                  placeholder="Select Status..."
                  isMulti={false}
                />
                <ErrorMessage name="status" component="div" className="invalid-feedback" />
              </div> */}

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
                <ErrorMessage name="type" component="div" className="invalid-feedback" />
              </div> */}
          </div>
        </div>
        <FocusError />
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          Close
        </button>
        <button type="button" disabled={isSubmitting} className="btn btn-primary" onClick={submitForm}>
          {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
          Create New Wallet
        </button>
      </Modal.Footer>
    </Modal>
  );
};

const enhanceWithFormik = withFormik<OtherProps, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema,
  handleSubmit: async (values: FormValues, { props, setSubmitting, resetForm }) => {
    const { setShow, onSuccess, onFailure } = props;

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
      setSubmitting(false);
      setShow(false);
      resetForm();
      if (onSuccess) onSuccess(response);
    } catch (error) {
      setSubmitting(false);
      setShow(false);
      if (onFailure) onFailure(error);
    }
  }
});

export const AddWalletModal = enhanceWithFormik(memo(InnerForm));
