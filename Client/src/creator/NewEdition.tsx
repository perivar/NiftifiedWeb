import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import { Formik, FormikHelpers, FormikProps, Form, Field, FieldProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';

const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
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
  const { setFieldValue } = props;
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
        {isDragActive ? <p>Drop the file here ...</p> : <p>Drag 'n' drop a file here, or click to select file</p>}
        <i className="far fa-image fa-4x" aria-hidden="true"></i>
      </div>
      <aside style={thumbsContainerStyle}>{thumbs}</aside>
    </section>
  );
}

interface FormValues {
  file: File | null; // this Object holds a reference to the file on disk
  lastName: string;
}

export const NewEdition = () => {
  const initialValues: FormValues = {
    file: null,
    lastName: ''
  };

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required('File is required'),
    lastName: Yup.string().required('Last Name is required')
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

  return (
    <div className="container">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        render={({ values, handleSubmit, setFieldValue, errors, touched, isSubmitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group col">
                  <UploadImageComponent setFieldValue={setFieldValue} />
                  {values && values.file && (
                    <>
                      <small>{`File:${values.file.name} Type:${values.file.type} Size:${values.file.size} bytes`}</small>
                    </>
                  )}
                  <ErrorMessage name="file" component="div" className="text-danger" />
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

              <div className="form-group">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  Register
                </button>
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};
