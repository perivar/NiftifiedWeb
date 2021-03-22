import React, { memo, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { niftyService, alertService } from '../../_services';
import { Form, Field, ErrorMessage, withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import FocusError from '../../_common/FocusError';
import CustomSelect from '../../_common/select/CustomSelect';
import { FormValues, Status, PersonType, WalletType, statusOptions, typeOptions } from './NewPerson';
import { makeWallet } from '../wallet/GenerateWallet';
import { encrypt, decrypt } from '../wallet/webcrypto';

const validationSchema = Yup.object().shape({
  alias: Yup.string().required('Alias is required'),
  salesCommisionShare: Yup.number().max(100, 'The share cannot be more than 100 (percent)')
});

const FormModal = (props: any & FormikProps<FormValues>) => {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, title } = props;
  const { show, setShow } = props;

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Form>
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
              </div>

              <div className="form-group">
                <label htmlFor="theme">Sales Commision Share (out of 100)</label>
                <Field
                  id="salesCommisionShare"
                  name="salesCommisionShare"
                  type="number"
                  className={`form-control${
                    errors.salesCommisionShare && touched.salesCommisionShare ? ' is-invalid' : ''
                  }`}
                />
                <small id="salesCommisionShare" className="form-text text-muted">
                  This is the share in percentage of creator. If Sole Creator, this is 100.
                </small>
                <ErrorMessage name="salesCommisionShare" component="div" className="invalid-feedback" />
              </div>
            </div>
          </div>
          <FocusError />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button type="button" disabled={isSubmitting} className="btn btn-primary" onClick={handleSubmit}>
            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
            Create New Person
          </button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
};

const initialValues: FormValues = {
  alias: '',
  isAnonymous: false,
  accountId: 0,
  status: Status.Pending,
  type: PersonType.Creator,
  salesCommisionShare: 100,

  // wallet info
  name: 'wallet',
  walletType: WalletType.Nifty,
  privateKeyEncrypted: '',
  privateKeyWIFEncrypted: '',
  publicAddress: '',
  publicKey: '',
  publicKeyHash: ''
};

const enhanceWithFormik = withFormik<any, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema,
  handleSubmit: (values: any, { setSubmitting, props }) => {
    const { show, setShow } = props;
    setShow(false);
    setSubmitting(false);

    console.log(values);
  }
});

export const AddPersonModal = enhanceWithFormik(memo(FormModal));
