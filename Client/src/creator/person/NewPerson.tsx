import React, { useEffect } from 'react';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../../_services';
import CustomSelect from '../../_common/select/CustomSelect';
import FocusError from '../../_common/FocusError';
import * as Scroll from 'react-scroll';
// import { Link } from 'react-router-dom';
import { makeWallet } from '../wallet/GenerateWallet';
import { encrypt, decrypt } from '../wallet/webcrypto';
import { Status, statusOptions, WalletType } from '../../_common/enums';

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

  const validationSchema = Yup.object().shape({
    alias: Yup.string().required('Alias is required'),
    isAnonymous: Yup.boolean().required('Please choose wheter you want to be anonymous')
  });

  const onSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    // alert(JSON.stringify(values, null, 2));
    formikHelpers.setSubmitting(true);

    try {
      const wallet = makeWallet();
      // console.log(wallet);
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
        })
        .catch((err) => {
          // got error
          return 'FAILED';
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
                      component={CustomSelect}
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
