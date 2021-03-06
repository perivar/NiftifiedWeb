import React, { useState } from 'react';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { niftyService, alertService } from '../../_services';
import FormikCreatableSelect from '../../_common/select/FormikCreatableSelect';
import FocusError from '../../_common/FocusError';
import * as Scroll from 'react-scroll';
import { Creator, AddCreatorsField } from '../wallet/AddCreatorsField';
import { Link } from 'react-router-dom';

// read from .env files
const config = { storedFilesPath: process.env.REACT_APP_STORED_FILES_PATH };

const scroll = Scroll.animateScroll;

export interface EditFormValues {
  dataSourcePath: string;
  dataSourceFileName: string;
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
  creators: Creator[];
  // owner does not create on edition after creation
}

export const EditEditionForm = ({ history, match }: { history: any; match: any }) => {
  // const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [edition, setEdition] = useState<any>([]);

  const validationSchema = Yup.object().shape({
    tags: Yup.array().min(1, 'At least one tag is required'),
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    volumeCount: Yup.number()
      .integer()
      .min(1, 'At least one volume is required')
      .max(1000, 'Cannot exceed 1000 volumes'),
    creators: Yup.array().min(1, 'At least one creator is required'),
    creatorsCommissionSum: Yup.number()
      .integer()
      .min(100, 'Commission must sum up to 100 (percent)')
      .max(100, 'Commission must sum up to 100 (percent)')
  });

  const onSubmit = (values: EditFormValues, formikHelpers: FormikHelpers<EditFormValues>) => {
    // alert(JSON.stringify(values, null, 2));
    formikHelpers.setSubmitting(true);
    niftyService
      .updateEdition(id, values)
      .then(() => {
        formikHelpers.setSubmitting(false);
        alertService.success('Successfully updated the edition!', {
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

  // load edtion by id async
  React.useEffect(() => {
    setLoading(true);

    niftyService
      .getEditionById(id)
      .then((res) => {
        const values: EditFormValues = {
          dataSourcePath: res.dataSourcePath,
          dataSourceFileName: res.dataSourceFileName,
          name: res.name,
          description: res.description,
          version: res.version,
          notes: res.notes,
          series: res.series,
          boxName: res.boxName,
          theme: res.theme,
          collection: optionsMapper(res.collection),
          volumeCount: res.volumeCount,
          tags: res.tags.map((obj: any) => {
            const newOption = optionsMapper(obj);
            return newOption;
          }),
          creators: res.creators
        };
        setEdition(values);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const initialValues: EditFormValues = {
    dataSourcePath: edition.dataSourcePath,
    dataSourceFileName: edition.dataSourceFileName,
    name: edition.name,
    description: edition.description,
    version: edition.version,
    notes: edition.notes,
    series: edition.series,
    boxName: edition.boxName,
    theme: edition.theme,
    collection: edition.collection,
    volumeCount: edition.volumeCount,
    tags: edition.tags,
    creators: edition.creators
    // owner does not exist on edition after creation
  };

  // mapper function
  const optionsMapper = (obj: any): any => {
    if (obj) {
      return {
        label: obj.name,
        value: obj.id
      };
    }
    return {};
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
                  <div className="col-lg-4">
                    <div className="form-group m-3">
                      <img
                        className="img-thumbnail"
                        alt={edition.name}
                        src={`${config.storedFilesPath}/${edition.dataSourceFileName}`}></img>
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
                        Please describe your edition with a somewhat unique name so that potential buyers can find YOUR
                        creation easiliy.
                      </small>
                      <ErrorMessage name="name" component="div" className="invalid-feedback" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="theme">Number of volumes (versions)</label>
                      <input className="form-control" type="text" placeholder={edition.volumeCount} readOnly />
                      <small id="volumeCountHelpBlock" className="form-text text-muted">
                        You cannot modify the volumes after creation. If none are minted, you can delete the edition and
                        recreate it.
                      </small>
                      <ErrorMessage name="volumeCount" component="div" className="invalid-feedback" />
                    </div>

                    <div className="form-group">
                      <div className="form-group">
                        <label htmlFor="creators">Owner</label>
                        <Link to={`/creator/volumes/${id}`} className="btn btn-sm btn-light btn-block">
                          View who owns the {edition.volumeCount} volumes
                        </Link>
                        <small id="ownerHelpBlock" className="form-text text-muted">
                          You cannot modify the owner after creation. If none are minted, you can delete the edition and
                          rest the owner.
                        </small>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="form-group">
                        <label htmlFor="creators">Creators</label>
                        <Field name="creators" className="form-control rounded-0" component={AddCreatorsField} />
                        <ErrorMessage name="creators" component="div" className="invalid-feedback show-block" />
                        <ErrorMessage
                          name="creatorsCommissionSum"
                          component="div"
                          className="invalid-feedback show-block"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tags">Tags</label>
                      <Field
                        name="tags"
                        component={FormikCreatableSelect}
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
                  <div className="form-group col-lg">
                    <label htmlFor="theme">Collection</label>
                    <Field
                      name="collection"
                      component={FormikCreatableSelect}
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
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save Edition
                  </button>
                  <Link to={`/creator`} className="ml-2 btn btn-secondary">
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
