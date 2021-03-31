import React, { memo } from 'react';
import { Form, Field, ErrorMessage, FormikProps, withFormik } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../../_services';
import CustomCreatableSelect from '../../_common/select/CustomCreatableSelect';
import FocusError from '../../_common/FocusError';
import UploadImageComponent from '../../_common/UploadComponent';
import * as Scroll from 'react-scroll';
// import { Link } from 'react-router-dom';
import { AddCreatorsField } from '../person/AddCreatorsField';
import { AddOwnerField } from '../person/AddOwnerField';
import { Link } from 'react-router-dom';

const scroll = Scroll.animateScroll;

interface FormValues {
  file: File | null; // this Object holds a reference to the file on disk
  name: string;
  description: string;
  version: string;
  notes: string;
  series: string;
  boxName: string;
  theme: string;
  collection: string;
  volumeCount: number;
  tags: string[];
  amount: number; // Initial amount for auctions or the selling price for fixed price sales
  currencyUniqueId: string;

  creators: any; // added here as an object array, and modified in nifty-service.ts before being sent
  creatorsCommissionSum: number;

  owner: any; // owner does not exist on edition after creation, only volumes
}

// mapper function
const optionsMapper = (obj: any): any => ({
  label: obj.name,
  value: obj.id
});

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('A file is required'),
  tags: Yup.array().min(1, 'At least one tag is required'),
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  volumeCount: Yup.number().integer().min(1, 'At least one volume is required').max(1000, 'Cannot exceed 1000 volumes'),
  creators: Yup.array().min(1, 'At least one creator is required'),
  creatorsCommissionSum: Yup.number()
    .integer()
    .min(100, 'Commission must be a total of 100')
    .max(100, 'Commission must be a total of 100'),
  owner: Yup.mixed().required('An owner is required')
});

// check https://medium.com/fotontech/forms-with-formik-typescript-d8154cc24f8a
// and https://stackoverflow.com/questions/65001954/formik-form-not-submitting-from-modal-component
const InnerForm = (props: any & FormikProps<FormValues>) => {
  const { errors, touched, submitForm, isSubmitting } = props;

  return (
    <Form>
      <div className="form-row">
        <div className="col-lg-4">
          <div className="form-group">
            <Field id="file" name="file" component={UploadImageComponent} />
            <div className="ml-3">
              <ErrorMessage name="file" component="div" className="invalid-feedback show-block" />
            </div>
          </div>
        </div>
        <div className="col-lg">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <Field
              id="name"
              name="name"
              type="text"
              className={`form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
            />
            <small id="nameHelpBlock" className="form-text text-muted">
              Please describe your edition with a somewhat unique name so that potential buyers can find YOUR creation
              easiliy.
            </small>
            <ErrorMessage name="name" component="div" className="invalid-feedback" />
          </div>

          <div className="form-group">
            <label htmlFor="theme">Number of volumes (versions)</label>
            <Field
              id="volumeCount"
              name="volumeCount"
              type="number"
              className={`form-control${errors.volumeCount && touched.volumeCount ? ' is-invalid' : ''}`}
            />
            <small id="volumeCountHelpBlock" className="form-text text-muted">
              This is the total number of volumes to be produced for this edition
            </small>
            <ErrorMessage name="volumeCount" component="div" className="invalid-feedback" />
          </div>

          <div className="form-group">
            <div className="form-group">
              <label htmlFor="creators">Owner</label>
              <Field name="owner" className="form-control rounded-0" component={AddOwnerField} />
              <ErrorMessage name="owner" component="div" className="invalid-feedback show-block" />
            </div>
          </div>

          <div className="form-group">
            <div className="form-group">
              <label htmlFor="creators">Creators</label>
              <Field name="creators" className="form-control rounded-0" component={AddCreatorsField} />
              <ErrorMessage name="creators" component="div" className="invalid-feedback show-block" />
              <ErrorMessage name="creatorsCommissionSum" component="div" className="invalid-feedback show-block" />
            </div>
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
            <ErrorMessage name="tags" component="div" className="invalid-feedback show-block" />
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
        <div className="form-group col-lg">
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

        <div className="form-group col-lg">
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
        <div className="form-group col-lg">
          <label htmlFor="notes">Notes</label>
          <Field
            id="notes"
            name="notes"
            type="text"
            className={`form-control${errors.notes && touched.notes ? ' is-invalid' : ''}`}
          />
          <ErrorMessage name="notes" component="div" className="invalid-feedback" />
        </div>

        <div className="form-group col-lg">
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
        <div className="form-group col-lg">
          <label htmlFor="boxName">Box Name</label>
          <Field
            id="boxName"
            name="boxName"
            type="text"
            className={`form-control${errors.boxName && touched.boxName ? ' is-invalid' : ''}`}
          />
          <ErrorMessage name="series" component="div" className="invalid-feedback" />
        </div>

        <div className="form-group col-lg">
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
        <button type="button" disabled={isSubmitting} className="btn btn-primary" onClick={submitForm}>
          {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
          Save Edition
        </button>
        <Link to={`/creator`} className="ml-2 btn btn-secondary">
          Cancel
        </Link>
      </div>
      <FocusError />
    </Form>
  );
};

const initialValues: FormValues = {
  file: null,
  name: '',
  description: '',
  version: '',
  notes: '',
  series: '',
  boxName: '',
  theme: '',
  collection: '',
  volumeCount: 1,
  tags: [],
  amount: 1,
  currencyUniqueId: 'NFY',

  creators: [],
  creatorsCommissionSum: 0,

  owner: null // owner does not exist on edition after creation, only volumes
};

const enhanceWithFormik = withFormik<any, FormValues>({
  mapPropsToValues: () => initialValues,
  validationSchema,
  handleSubmit: (values: FormValues, { props, setSubmitting }) => {
    const { history } = props;

    try {
      niftyService
        .createEdition(values)
        .then(() => {
          setSubmitting(false);
          alertService.success('Successfully created a new edition!', {
            keepAfterRouteChange: true
          });
          history.push('/creator');
        })
        .catch((error) => {
          setSubmitting(false);
          alertService.error(error, { autoClose: false });
          scroll.scrollToTop();
        });
    } catch (error) {
      setSubmitting(false);
      alertService.error(error, { autoClose: false });
      scroll.scrollToTop();
    }
  }
});

export const NewEditionForm = enhanceWithFormik(memo(InnerForm));
