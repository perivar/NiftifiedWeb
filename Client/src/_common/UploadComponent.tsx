import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldProps } from 'formik';

const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px',
  borderWidth: 1,
  borderRadius: 4,
  borderColor: '#cccccc',
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

function UploadImageComponent({ field, form }: FieldProps) {
  const { setFieldValue } = form; // access formiks values

  // set initial value using formiks values for form.values and field.name
  // const [files, setFiles] = useState<any>(form.values[field.name]);
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
    <div key={file.name}>
      <div>
        <img className="img-thumbnail" src={file.preview} alt={file.name} />
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
    <section className="container-fluid">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="font-weight-light text-center">Drop the file here ...</div>
        ) : (
          <>
            <div className="font-weight-light text-center">Drag 'n' drop file here, or click to select</div>
          </>
        )}
        <i className="far fa-image fa-3x" aria-hidden="true"></i>
      </div>
      <aside className="mt-2">{thumbs}</aside>
      {files && files[0] && (
        <small>
          <ul className="list-unstyled mt-2">
            <li>{`Filename: ${files[0].name}`}</li>
            <li>{`Type: ${files[0].type}`}</li>
            <li>{`Size: ${files[0].size} bytes`}</li>
          </ul>
        </small>
      )}
    </section>
  );
}

export default UploadImageComponent;
