import React, { useEffect } from 'react';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../../_services';
import CustomSelect from '../../_common/select/CustomSelect';
import FocusError from '../../_common/FocusError';
import * as Scroll from 'react-scroll';
import { Link } from 'react-router-dom';
import { makeWallet } from '../wallet/GenerateWallet';

const scroll = Scroll.animateScroll;

export enum PersonType {
  Owner,
  Creator,
  CoCreator,
  Publisher,
  Producer,
  Other
}

export enum Status {
  Pending,
  Active,
  Cancelled,
  Expired
}

export enum WalletType {
  Nifty,
  Other
}

// Helper
const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

// Turn enum into array
function ToOptionArray(enumme: any) {
  return Object.keys(enumme)
    .filter(StringIsNumber)
    .map((key) => {
      return {
        label: enumme[key],
        value: Number(key) // force as number
      };
    });
}

export const statusOptions = ToOptionArray(Status);
export const typeOptions = ToOptionArray(PersonType);

interface FormValues {
  alias: string;
  isAnonymous: boolean;
  accountId: number;
  status: Status;
  type: PersonType; // creator, co-creator?
  salesCommisionShare: number;

  // wallet info
  name: string;
  walletType: WalletType;
  privateKeyEncrypted: string;
  privateKeyWIFEncrypted: string;
  publicAddress: string;
  publicKey: string;
  publicKeyHash: string;
}

export const NewPersonForm = ({ history }: { history: any }) => {
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

  const validationSchema = Yup.object().shape({
    // alias: Yup.string().required('Alias is required')
    isAnonymous: Yup.boolean().required('Please choose wheter you want to be anonymous')
  });

  const onSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    // alert(JSON.stringify(values, null, 2));
    formikHelpers.setSubmitting(true);

    try {
      const wallet = makeWallet();
      console.log(wallet);
      values.publicKey = wallet.publicKey;
      values.publicKeyHash = wallet.publicKeyHash;
      values.publicAddress = wallet.publicAddress;
      values.privateKeyEncrypted = wallet.privateKey;
      values.privateKeyWIFEncrypted = wallet.privateKeyWIF;

      niftyService
        .createPerson(values)
        .then(() => {
          formikHelpers.setSubmitting(false);
          alertService.success('Successfully created a new person!', {
            keepAfterRouteChange: true
          });
          history.push('/creator/profile');
        })
        .catch((error) => {
          formikHelpers.setSubmitting(false);
          alertService.error(error, { autoClose: false });
          scroll.scrollToTop();
        });
    } catch (e) {
      console.log(e);
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
                      Please choose a cool alias.
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
                      component={CustomSelect}
                      placeholder="Select Status..."
                      isMulti={false}
                    />
                    <ErrorMessage name="status" component="div" className="invalid-feedback  show-block" />
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
                    <ErrorMessage name="type" component="div" className="invalid-feedback  show-block" />
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
              <div className="form-group">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  Save Person
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
