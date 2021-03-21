import React, { useEffect, useState } from 'react';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../../_services';
import CustomSelect from '../../_common/select/CustomSelect';
import FocusError from '../../_common/FocusError';
import * as Scroll from 'react-scroll';
import { Link } from 'react-router-dom';
import { makeWallet } from '../wallet/GenerateWallet';
import { encrypt, decrypt } from '../wallet/webcrypto';
import { FormValues, Status, PersonType, WalletType, statusOptions, typeOptions } from './NewPerson';

const scroll = Scroll.animateScroll;

export const EditPersonForm = ({ history, match }: { history: any; match: any }) => {
  // const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [person, setPerson] = useState<any>([]);

  // load person by id async
  React.useEffect(() => {
    setLoading(true);
    niftyService
      .getPersonById(id)
      .then((res) => {
        const values: FormValues = {
          alias: res.alias,
          isAnonymous: res.isAnonymous,
          accountId: res.accountId,
          status: res.status,
          type: res.type,
          salesCommisionShare: res.salesCommisionShare,

          // wallet info
          name: res.name,
          walletType: res.walletType,
          privateKeyEncrypted: res.privateKeyEncrypted,
          privateKeyWIFEncrypted: res.privateKeyWIFEncrypted,
          publicAddress: res.publicAddress,
          publicKey: res.publicKey,
          publicKeyHash: res.publicKeyHash
        };
        setPerson(values);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const initialValues: FormValues = {
    alias: person.alias,
    isAnonymous: person.isAnonymous,
    accountId: person.accountId,
    status: person.status,
    type: person.type,
    salesCommisionShare: person.salesCommisionShare,

    // wallet info
    name: person.name,
    walletType: person.walletType,
    privateKeyEncrypted: person.privateKeyEncrypted,
    privateKeyWIFEncrypted: person.privateKeyWIFEncrypted,
    publicAddress: person.publicAddress,
    publicKey: person.publicKey,
    publicKeyHash: person.publicKeyHash
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
        .updatePerson(id, values)
        .then(() => {
          formikHelpers.setSubmitting(false);
          alertService.success('Successfully updated a new person!', {
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
      )}
    </>
  );
};
