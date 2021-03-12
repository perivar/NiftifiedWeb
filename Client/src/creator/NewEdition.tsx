import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
// import AsyncCreatableSelect from 'react-select/async-creatable';
import { niftyService, alertService } from '../_services';
import CustomCreatableSelect from '../_common/select/CustomCreatableSelect';

const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle: CSSProperties = {
  borderColor: '#2196f3'
};

const acceptStyle: CSSProperties = {
  borderColor: '#00e676'
};

const rejectStyle: CSSProperties = {
  borderColor: '#ff1744'
};

const thumbsContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumbStyle: CSSProperties = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 200,
  height: 200,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInnerStyle: CSSProperties = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const imgStyle: CSSProperties = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function UploadImageComponent(props: any) {
  const { setFieldValue } = props; // access formiks values
  const [files, setFiles] = useState<any>([]);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
      // make sure formik sees this as well
      setFieldValue('file', acceptedFiles[0]);
    }
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const thumbs = files.map((file: any) => (
    <div style={thumbStyle} key={file.name}>
      <div style={thumbInnerStyle}>
        <img src={file.preview} style={imgStyle} alt={file.name} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <>
            <div>Drag 'n' drop a file here,</div>
            <div>or click to select file</div>
          </>
        )}
        <i className="far fa-image fa-4x" aria-hidden="true"></i>
      </div>
      <aside style={thumbsContainerStyle}>{thumbs}</aside>
      {files && files[0] && (
        <small>
          <ul className="list-unstyled">
            <li>{`Filename: ${files[0].name}`}</li>
            <li>{`Type: ${files[0].type}`}</li>
            <li>{`Size: ${files[0].size} bytes`}</li>
          </ul>
        </small>
      )}
    </section>
  );
}

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
  volumeTotal: number;
  tags: string[];
  externalDataSource: string;
  externalDataSourceFileType: string;
}

export const NewEditionForm = () => {
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
    volumeTotal: 1,
    tags: [''],
    externalDataSource: '',
    externalDataSourceFileType: ''
  };

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required('File is required'),
    name: Yup.string().required('Name is required'),
    volumeTotal: Yup.number().integer().min(1).max(1000).required('Total number of volumes are required')
  });

  const onSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    // alert(JSON.stringify(values, null, 2));
    niftyService
      .createEdition(values)
      .then(() => {
        formikHelpers.setSubmitting(true);
        alertService.success('Successfully created a new edition!', {
          keepAfterRouteChange: true
        });
      })
      .catch((error) => {
        formikHelpers.setSubmitting(false);
        alertService.error(error, { autoClose: false });
      });
  };

  const onCollectionChange = (newValue: any, actionMeta: any, setFieldValue: Function) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();

    if (actionMeta.action === 'create-option') {
      onCollectionCreate(newValue, setFieldValue);
    } else {
      setFieldValue('collection', newValue);
    }
  };

  const onCollectionCreate = (newValue: any, setFieldValue: any): any => {
    const { value } = newValue.find((obj: any) => obj.__isNew__ === true);

    niftyService
      .createCollection(value)
      .then((res) => {
        const { id } = res;
        const { name } = res;
        const option = { label: name, value: id };
        // and concatinate the old list with the new
        const remaining = newValue.filter((obj: any) => obj.label !== value);
        const newCollection = { ...remaining, option };
        setFieldValue('collection', newCollection);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadCollectionOptions = (value: string, callback: Function) => {
    niftyService
      .getCollections()
      .then((res) => {
        const options = res.map((obj: any) => {
          const value = obj.id;
          const label = obj.name;
          return { label, value };
        });
        callback(options);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // mapper function
  const optionsMapper = (obj: any): any => ({
    label: obj.name,
    value: obj.id
  });

  return (
    <div className="container">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        render={({ setFieldValue, errors, touched, isSubmitting }) => {
          return (
            <Form>
              <div className="row">
                <div className="col-4">
                  <UploadImageComponent setFieldValue={setFieldValue} />
                  <ErrorMessage name="file" component="div" className="invalid-feedback show-block" />
                </div>
                <div className="col-8">
                  <div className="form-row">
                    <div className="form-group col-8">
                      <label htmlFor="name">Name</label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className={`form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                      />
                      <small id="nameHelpBlock" className="form-text text-muted">
                        Please describe your edition with a somewhat unique name
                      </small>
                      <ErrorMessage name="name" component="div" className="invalid-feedback" />
                    </div>

                    <div className="form-group col-4">
                      <label htmlFor="theme">Number of volumes (versions)</label>
                      <Field
                        id="volumeTotal"
                        name="volumeTotal"
                        type="number"
                        className={`form-control${errors.volumeTotal && touched.volumeTotal ? ' is-invalid' : ''}`}
                      />
                      <small id="volumeTotalHelpBlock" className="form-text text-muted">
                        This is the total number of volumes to be produced for this edition
                      </small>
                      <ErrorMessage name="volumeTotal" component="div" className="invalid-feedback" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-12">
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
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-12">
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
              </div>

              {/* <div className="row mt-2">
                    <label htmlFor="tags">Tags</label>
                    <div style={{ width: '100%' }}>
                      <AsyncCreatableSelect
                        isMulti
                        cacheOptions
                        defaultOptions
                        loadOptions={loadTagOptions}
                        // onCreateOption={onTagCreateOption}
                        // onChange={onTagChange}
                        onChange={(newValue: any, actionMeta: any) => {
                          onTagChange(newValue, actionMeta, setFieldValue);
                        }}
                        onBlur={() => setFieldTouched('tags', true)}
                      />
                    </div>
                  </div> */}

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
            </Form>
          );
        }}
      />
    </div>
  );
};
