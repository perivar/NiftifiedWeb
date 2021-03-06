import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FormikSelect from '../../_common/select/FormikSelect';
import { languageOptions } from '../../_common/languageOptions';

import { accountService, alertService } from '../../_services';

function AddEdit({ history, match }: { history: any; match: any }) {
  const { id } = match.params;
  const isAddMode = !id;

  const initialValues = {
    languageCode: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object().shape({
    languageCode: Yup.string().required('Language is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string()
      .concat(isAddMode ? Yup.string().required('Password is required') : Yup.string())
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .when('password', (password: any, schema: any) => {
        if (password) {
          return schema.required('Confirm Password is required');
        }
        return Yup.string();
      })
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });

  function onSubmit(fields: any, { setStatus, setSubmitting }: { setStatus: any; setSubmitting: any }) {
    setStatus();
    if (isAddMode) {
      createUser(fields, setSubmitting);
    } else {
      updateUser(id, fields, setSubmitting);
    }
  }

  function createUser(fields: any, setSubmitting: any) {
    accountService
      .create(fields)
      .then(() => {
        alertService.success('User added successfully', { keepAfterRouteChange: true });
        history.push('.');
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function updateUser(id: string, fields: any, setSubmitting: any) {
    accountService
      .update(id, fields)
      .then(() => {
        alertService.success('Update successful', { keepAfterRouteChange: true });
        history.push('..');
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched, isSubmitting, setFieldValue }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (!isAddMode) {
            // get user and set form fields
            accountService.getById(id).then((user) => {
              const fields = ['languageCode', 'firstName', 'lastName', 'email', 'role'];
              fields.forEach((field) => setFieldValue(field, user[field], false));
            });
          }
        }, []);

        return (
          <div className="col-sm-8 offset-sm-2">
            <Form>
              <h4>{isAddMode ? 'Add User' : 'Edit User'}</h4>
              <div className="form-row">
                <div className="form-group col-lg-6">
                  <label htmlFor="languageCode">Language</label>
                  <Field
                    id="languageCode"
                    name="languageCode"
                    type="text"
                    options={languageOptions}
                    component={FormikSelect}
                    placeholder="Select language..."
                    isMulti={false}
                  />
                  <ErrorMessage name="languageCode" component="div" className="invalid-feedback show-block" />
                  <small>This is the preferred language you want to use.</small>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-lg">
                  <label htmlFor="firstName">First Name</label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`form-control${errors.firstName && touched.firstName ? ' is-invalid' : ''}`}
                  />
                  <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                </div>
                <div className="form-group col-lg">
                  <label htmlFor="lastName">Last Name</label>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`form-control${errors.lastName && touched.lastName ? ' is-invalid' : ''}`}
                  />
                  <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-lg-6">
                  <label htmlFor="email">Email</label>
                  <Field
                    id="email"
                    name="email"
                    type="text"
                    className={`form-control${errors.email && touched.email ? ' is-invalid' : ''}`}
                  />
                  <ErrorMessage name="email" component="div" className="invalid-feedback" />
                </div>
                <div className="form-group col-lg">
                  <label htmlFor="role">Role</label>
                  <Field
                    id="role"
                    name="role"
                    as="select"
                    className={`form-control form-select${errors.role && touched.role ? ' is-invalid' : ''}`}>
                    <option value=""></option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="invalid-feedback" />
                </div>
              </div>
              {!isAddMode && (
                <div>
                  <h4 className="pt-3">Change Password</h4>
                  <p>Leave blank to keep the same password</p>
                </div>
              )}
              <div className="form-row">
                <div className="form-group col-lg">
                  <label htmlFor="password">Password</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                  />
                  <ErrorMessage name="password" component="div" className="invalid-feedback" />
                </div>
                <div className="form-group col-lg">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`form-control${errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : ''}`}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                </div>
              </div>
              <div className="form-group">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  Save
                </button>
                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">
                  Cancel
                </Link>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export { AddEdit };
