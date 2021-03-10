import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { InputTags } from '../_common/tagsinput/InputTags';

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
    volumeTotal: Yup.number().required('Total number of volumes are required')
  });

  const onSubmit = (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    formikHelpers.setSubmitting(false);

    if (values.file) {
      alert(
        JSON.stringify(
          {
            fileName: values.file.name,
            type: values.file.type,
            size: `${values.file.size} bytes`
          },
          null,
          2
        )
      );
    }
  };

  const [tagState, setTagState] = useState<string[]>([]);

  return (
    <div className="container">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        render={({ setFieldValue, errors, touched, isSubmitting }) => {
          return (
            <Form>
              <div className="form-row">
                <div className="form-group col-4">
                  <UploadImageComponent setFieldValue={setFieldValue} />
                  <ErrorMessage name="file" component="div" className="invalid-feedback show-block" />
                </div>
                <div className="form-group col">
                  <div className="row">
                    <label htmlFor="name">Name</label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className={`form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                    />
                    <small id="nameHelpBlock" className="form-text text-muted">
                      Please describe your edition with a hopefully unique name
                    </small>
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                  </div>

                  <div className="row mt-2">
                    <label htmlFor="tags">Tags</label>
                    <div className="input-group">
                      <InputTags id="tags" values={tagState} onTags={(value) => setTagState(value.values)} />
                    </div>
                  </div>

                  <div className="row mt-2">
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

                  <div className="row mt-2">
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
                <div className="form-group col"></div>
              </div>

              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="theme">Collection</label>
                  <Field
                    id="collection"
                    name="collection"
                    type="text"
                    className={`form-control${errors.collection && touched.collection ? ' is-invalid' : ''}`}
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
