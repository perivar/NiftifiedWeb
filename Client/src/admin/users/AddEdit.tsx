import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CustomSelect from '../../_common/select/CustomSelect';
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
        // useEffect(() => {
        if (!isAddMode) {
          // get user and set form fields
          accountService.getById(id).then((user) => {
            const fields = ['languageCode', 'firstName', 'lastName', 'email', 'role'];
            fields.forEach((field) => setFieldValue(field, user[field], false));
          });
        }
        // }, []);

        return (
          <Form>
            <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="languageCode">Language</label>
                <Field
                  id="languageCode"
                  name="languageCode"
                  type="text"
                  options={languageOptions}
                  component={CustomSelect}
                  placeholder="Select language..."
                  isMulti={false}
                />
                <ErrorMessage name="languageCode" component="div" className="invalid-feedback show-block" />
                <small>This is the preferred language you want to use.</small>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="firstNameField">First Name</label>
                <Field
                  id="firstNameField"
                  name="firstName"
                  type="text"
                  className={`form-control${errors.firstName && touched.firstName ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
              </div>
              <div className="form-group col">
                <label htmlFor="lastNameField">Last Name</label>
                <Field
                  id="lastNameField"
                  name="lastName"
                  type="text"
                  className={`form-control${errors.lastName && touched.lastName ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-7">
                <label htmlFor="emailField">Email</label>
                <Field
                  id="emailField"
                  name="email"
                  type="text"
                  className={`form-control${errors.email && touched.email ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="email" component="div" className="invalid-feedback" />
              </div>
              <div className="form-group col">
                <label htmlFor="roleField">Role</label>
                <Field
                  id="roleField"
                  name="role"
                  as="select"
                  className={`form-control${errors.role && touched.role ? ' is-invalid' : ''}`}>
                  <option value=""></option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="invalid-feedback" />
              </div>
            </div>
            {!isAddMode && (
              <div>
                <h3 className="pt-3">Change Password</h3>
                <p>Leave blank to keep the same password</p>
              </div>
            )}
            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="passwordField">Password</label>
                <Field
                  id="passwordField"
                  name="password"
                  type="password"
                  className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="password" component="div" className="invalid-feedback" />
              </div>
              <div className="form-group col">
                <label htmlFor="confirmPasswordField">Confirm Password</label>
                <Field
                  id="confirmPasswordField"
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
        );
      }}
    </Formik>
  );
}

export { AddEdit };
