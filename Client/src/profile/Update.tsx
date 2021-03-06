import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '../_services';

function Update({ history }: { history: any }) {
  const user = accountService.userValue;
  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .when('password', (password: string, schema: any) => {
        if (password) {
          return schema.required('Confirm Password is required');
        }
        return Yup.string();
      })
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });

  function onSubmit(fields: any, { setStatus, setSubmitting }: { setStatus: any; setSubmitting: any }) {
    setStatus();
    accountService
      .update(user.id, fields)
      .then(() => {
        alertService.success('Update successful', { keepAfterRouteChange: true });
        history.push('.');
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  const [isDeleting, setIsDeleting] = useState(false);
  function onDelete() {
    if (confirm('Are you sure?')) {
      setIsDeleting(true);
      accountService.delete(user.id).then(() => alertService.success('Account deleted successfully'));
    }
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <h4>Update Profile</h4>
          <div className="form-row">
            <div className="form-group col-lg">
              <label htmlFor="firstNameField">First Name</label>
              <Field
                id="firstNameField"
                name="firstName"
                type="text"
                className={`form-control${errors.firstName && touched.firstName ? ' is-invalid' : ''}`}
              />
              <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
            </div>
            <div className="form-group col-lg">
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
          <div className="form-group">
            <label htmlFor="emailField">Email</label>
            <Field
              id="emailField"
              name="email"
              type="text"
              className={`form-control${errors.email && touched.email ? ' is-invalid' : ''}`}
            />
            <ErrorMessage name="email" component="div" className="invalid-feedback" />
          </div>
          <h4 className="pt-3">Change Password</h4>
          <p>Leave blank to keep the same password</p>
          <div className="form-row">
            <div className="form-group col-lg">
              <label htmlFor="passwordField">Password</label>
              <Field
                id="passwordField"
                name="password"
                type="password"
                className={`form-control${errors.password && touched.password ? ' is-invalid' : ''}`}
              />
              <ErrorMessage name="password" component="div" className="invalid-feedback" />
            </div>
            <div className="form-group col-lg">
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
            <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Update
            </button>
            <button type="button" onClick={() => onDelete()} className="btn btn-danger" disabled={isDeleting}>
              {isDeleting ? <span className="spinner-border spinner-border-sm"></span> : <span>Delete</span>}
            </button>
            <Link to="." className="btn btn-link">
              Cancel
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export { Update };
