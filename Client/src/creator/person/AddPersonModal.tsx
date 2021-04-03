import React, { memo } from 'react';
import { Modal } from 'react-bootstrap';
import { niftyService } from '../../_services';
import { Form, Field, ErrorMessage, withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import FocusError from '../../_common/FocusError';
// import CustomSelect from '../../_common/select/CustomSelect';
import { FormValues } from './NewPerson';
import { Status, WalletType } from '../../_common/enums';
import { makeWallet } from '../wallet/GenerateWallet';
import { encrypt } from '../wallet/webcrypto';

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
  walletType: WalletType.Nifty,
  privateKeyEncrypted: '',
  privateKeyWIFEncrypted: '',
  publicAddress: '',
  publicKey: '',
  publicKeyHash: ''
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
    // <Form>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Person</Modal.Title>
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
                className={`form-control${errors.alias && touched.alias ? ' is-invalid' : ''}`}
              />
              <small id="nameHelpBlock" className="form-text text-muted">
                Please enter a name or an alias.
              </small>
              <ErrorMessage name="alias" component="div" className="invalid-feedback" />
            </div>
            <p>
              <strong>You are about to create a person with a new Crypto Wallet</strong>
            </p>
            <p>
              To protect the wallet (private keys) you will be asked to provide a pass phrase.
              <strong> Please make a note of this pass phrase</strong> since this is the <strong>ONLY</strong> way to
              ever get access to the wallet (private keys). Niftified.com does not have access to your private key!
            </p>
            <p className="text-danger">
              If you forget this, you will <strong>NEVER</strong> get access to the wallet, and any sales commission
              income for this person will be lost <strong>FOREVER!</strong>
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
          Create New Person
        </button>
      </Modal.Footer>
    </Modal>
    // </Form>
  );
};

const enhanceWithFormik = withFormik<OtherProps, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema,
  handleSubmit: (values: FormValues, { props, setSubmitting, resetForm }) => {
    const { setShow, onSuccess, onFailure } = props;

    try {
      const wallet = makeWallet();
      values.publicKey = wallet.publicKey;
      values.publicKeyHash = wallet.publicKeyHash;
      values.publicAddress = wallet.publicAddress;

      // TODO - do not save the private key in production
      // only while debugging
      // the same for generate wallet - remove the debug lines
      values.privateKeyEncrypted = wallet.privateKey;
      values.privateKeyWIFEncrypted = wallet.privateKeyWIF;
      // but keep both the unencoded and the encoded private key WIF to check
      // values.privateKeyEncrypted = wallet.privateKeyWIF;

      encrypt(wallet.privateKeyWIF)
        .then((encryptedData) => {
          // values.privateKeyWIFEncrypted = encryptedData;

          niftyService
            .createPerson(values)
            .then((val) => {
              setSubmitting(false);
              setShow(false);
              resetForm();
              if (onSuccess) onSuccess(val);
            })
            .catch((error) => {
              setSubmitting(false);
              setShow(false);
              if (onFailure) onFailure(error);
            });
        })
        .catch((error) => {
          setSubmitting(false);
          setShow(false);
          if (onFailure) onFailure(error);
        });
    } catch (error) {
      setSubmitting(false);
      setShow(false);
      if (onFailure) onFailure(error);
    }
  }
});

export const AddPersonModal = enhanceWithFormik(memo(InnerForm));
