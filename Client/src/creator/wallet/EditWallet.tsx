import React, { useState } from 'react';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../../_services';
import FormikSelect from '../../_common/select/FormikSelect';
import FocusError from '../../_common/FocusError';
import * as Scroll from 'react-scroll';
import { Link } from 'react-router-dom';
import { FormValues } from './NewWallet';
import { statusOptions } from '../../_common/enums';

const scroll = Scroll.animateScroll;

export const EditWalletForm = ({ history, match }: { history: any; match: any }) => {
  // const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>([]);

  // load wallet by id async
  React.useEffect(() => {
    setLoading(true);
    niftyService
      .getWalletById(id)
      .then((res) => {
        const values: FormValues = {
          alias: res.alias,
          isAnonymous: res.isAnonymous,
          accountId: res.accountId,
          status: res.status,
          // type: res.type,
          isConfirmed: res.isConfirmed,

          // wallet info
          name: res.name,
          walletType: res.walletType,
          privateKeyEncrypted: res.privateKeyEncrypted,
          privateKeyWIFEncrypted: res.privateKeyWIFEncrypted,
          privateMnemonicEncrypted: res.privateMnemonicEncrypted,
          publicAddress: res.publicAddress,
          publicKey: res.publicKey,
          publicKeyHash: res.publicKeyHash
        };
        setWallet(values);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const initialValues: FormValues = {
    alias: wallet.alias,
    isAnonymous: wallet.isAnonymous,
    accountId: wallet.accountId,
    status: wallet.status,
    // type: wallet.type,
    isConfirmed: wallet.isConfirmed,

    // wallet info
    name: wallet.name,
    walletType: wallet.walletType,
    privateKeyEncrypted: wallet.privateKeyEncrypted,
    privateKeyWIFEncrypted: wallet.privateKeyWIFEncrypted,
    privateMnemonicEncrypted: wallet.privateMnemonicEncrypted,
    publicAddress: wallet.publicAddress,
    publicKey: wallet.publicKey,
    publicKeyHash: wallet.publicKeyHash
  };

  const validationSchema = Yup.object().shape({
    // alias: Yup.string().required('Alias is required')
    isAnonymous: Yup.boolean().required('Please choose wheter you want to be anonymous')
  });

  const onSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    // alert(JSON.stringify(values, null, 2));
    formikHelpers.setSubmitting(true);

    try {
      niftyService
        .updateWallet(id, values)
        .then(() => {
          formikHelpers.setSubmitting(false);
          alertService.success('Successfully updated a new wallet!', {
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
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div className="container-fluid">
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {({ errors, touched, isSubmitting }) => (
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
                      <div className="form-check">
                        <Field className="form-check-input" type="checkbox" name="isConfirmed" />
                        <label className="form-check-label" htmlFor="isConfirmed">
                          Confirmed
                        </label>
                        <ErrorMessage name="isConfirmed" component="div" className="invalid-feedback" />
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
                  <Link to={`/creator/profile`} className="ml-2 btn btn-secondary">
                    Cancel
                  </Link>
                </div>
                <FocusError />
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
