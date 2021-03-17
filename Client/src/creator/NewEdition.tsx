import React from 'react';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../_services';
import CustomCreatableSelect from '../_common/select/CustomCreatableSelect';
import FocusError from '../_common/FocusError';
import UploadImageComponent from '../_common/UploadComponent';
import * as Scroll from 'react-scroll';
import { Link } from 'react-router-dom';

const scroll = Scroll.animateScroll;

interface FormValues {
  file: File | null; // this Object holds a reference to the file on disk
  accountIsCreator: boolean;
  name: string;
  description: string;
  version: string;
  notes: string;
  series: string;
  boxName: string;
  theme: string;
  collection: string;
  volumesCount: number;
  tags: string[];
  amount: number; // Initial amount for auctions or the selling price for fixed price sales
  currencyUniqueId: string;
}

export const NewEditionForm = ({ history }: { history: any }) => {
  const initialValues: FormValues = {
    file: null,
    accountIsCreator: true,
    name: '',
    description: '',
    version: '',
    notes: '',
    series: '',
    boxName: '',
    theme: '',
    collection: '',
    volumesCount: 1,
    tags: [],
    amount: 1,
    currencyUniqueId: 'NFY'
  };

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required('File is required'),
    tags: Yup.array().min(1, 'At least one tag is required'),
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    volumesCount: Yup.number()
      .integer()
      .min(1, 'At least one volume is required')
      .max(1000, 'Cannot exceed 1000 volumes')
  });

  const onSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    // alert(JSON.stringify(values, null, 2));
    formikHelpers.setSubmitting(true);
    niftyService
      .createEdition(values)
      .then(() => {
        formikHelpers.setSubmitting(false);
        alertService.success('Successfully created a new edition!', {
          keepAfterRouteChange: true
        });
        history.push('/creator');
      })
      .catch((error) => {
        formikHelpers.setSubmitting(false);
        alertService.error(error, { autoClose: false });
        scroll.scrollToTop();
      });
  };

  // mapper function
  const optionsMapper = (obj: any): any => ({
    label: obj.name,
    value: obj.id
  });

  return (
    <div className="container-fluid">
      <h4>You are now just one step away from creating your own crypto art...</h4>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ setFieldValue, values, errors, touched, isSubmitting }) => (
          <Form noValidate>
            <div className="form-row">
              <div className="col-4">
                <div className="form-group">
                  <Field id="file" name="file" component={UploadImageComponent} />
                  <div className="ml-3">
                    <ErrorMessage name="file" component="div" className="invalid-feedback show-block" />
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className={`form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                  />
                  <small id="nameHelpBlock" className="form-text text-muted">
                    Please describe your edition with a somewhat unique name so that potential buyers can find YOUR
                    creation easiliy.
                  </small>
                  <ErrorMessage name="name" component="div" className="invalid-feedback" />
                </div>

                <div className="form-group">
                  <label htmlFor="theme">Number of volumes (versions)</label>
                  <Field
                    id="volumesCount"
                    name="volumesCount"
                    type="number"
                    className={`form-control${errors.volumesCount && touched.volumesCount ? ' is-invalid' : ''}`}
                  />
                  <small id="volumesCountHelpBlock" className="form-text text-muted">
                    This is the total number of volumes to be produced for this edition
                  </small>
                  <ErrorMessage name="volumesCount" component="div" className="invalid-feedback" />
                </div>

                <div className="form-group">
                  <Field
                    type="checkbox"
                    name="accountIsCreator"
                    id="accountIsCreator"
                    className={`form-check-input ${
                      errors.accountIsCreator && touched.accountIsCreator ? ' is-invalid' : ''
                    }`}
                    onChange={() => setFieldValue('accountIsCreator', !values.accountIsCreator)}
                  />
                  <label htmlFor="accountIsCreator" className="form-check-label">
                    Account holder is Sole Creator
                  </label>
                  <ErrorMessage name="accountIsCreator" component="div" className="invalid-feedback" />
                  {values.accountIsCreator ? (
                    <small id="accountIsCreatorHelpBlock" className="form-text text-muted">
                      If this is checked, the account holder (logged in user) is also the Sole Creator and receives the
                      full sales commision whenever sold
                    </small>
                  ) : (
                    <p className="invalid-feedback show-block">
                      Currently only Account holder as Sole Creator is Supported
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Tags</label>
                  <Field
                    name="tags"
                    component={CustomCreatableSelect}
                    placeholder="Select Tag..."
                    isMulti={true}
                    optionsMapper={optionsMapper}
                    createOption={niftyService.createTag}
                    readOptions={niftyService.getTags}
                  />
                  <ErrorMessage name="tags" component="div" className="invalid-feedback  show-block" />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <Field
                    id="description"
                    name="description"
                    type="textarea"
                    as="textarea"
                    rows={5}
                    className={`form-control${errors.description && touched.description ? ' is-invalid' : ''}`}
                  />
                  <small id="nameHelpBlock" className="form-text text-muted">
                    This is your longer detailed description.
                  </small>
                  <ErrorMessage name="description" component="div" className="invalid-feedback" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="theme">Collection</label>
                <Field
                  name="collection"
                  component={CustomCreatableSelect}
                  placeholder="Select Collection ..."
                  isMulti={false}
                  optionsMapper={optionsMapper}
                  createOption={niftyService.createCollection}
                  readOptions={niftyService.getCollections}
                />
                <ErrorMessage name="collection" component="div" className="invalid-feedback" />
              </div>

              <div className="form-group col">
                <label htmlFor="version">Version</label>
                <Field
                  id="version"
                  name="version"
                  type="text"
                  className={`form-control${errors.version && touched.version ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="version" component="div" className="invalid-feedback" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="notes">Notes</label>
                <Field
                  id="notes"
                  name="notes"
                  type="text"
                  className={`form-control${errors.notes && touched.notes ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="notes" component="div" className="invalid-feedback" />
              </div>

              <div className="form-group col">
                <label htmlFor="series">Series</label>
                <Field
                  id="series"
                  name="series"
                  type="text"
                  className={`form-control${errors.series && touched.series ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="series" component="div" className="invalid-feedback" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col">
                <label htmlFor="boxName">Box Name</label>
                <Field
                  id="boxName"
                  name="boxName"
                  type="text"
                  className={`form-control${errors.boxName && touched.boxName ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="series" component="div" className="invalid-feedback" />
              </div>

              <div className="form-group col">
                <label htmlFor="theme">Theme</label>
                <Field
                  id="theme"
                  name="theme"
                  type="text"
                  className={`form-control${errors.theme && touched.theme ? ' is-invalid' : ''}`}
                />
                <ErrorMessage name="theme" component="div" className="invalid-feedback" />
              </div>
            </div>

            <div className="form-group">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                Save Edition
              </button>
            </div>
            <FocusError />
          </Form>
        )}
      </Formik>
    </div>
  );
};
