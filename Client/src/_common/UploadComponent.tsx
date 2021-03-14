import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';

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

export default UploadImageComponent;
