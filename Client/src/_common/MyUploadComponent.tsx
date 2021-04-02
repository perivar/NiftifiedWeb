import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import { FieldProps } from 'formik';

function MyUploadComponent({ field, form }: FieldProps) {
  const { setFieldValue } = form; // access formiks values

  // set initial value using formiks values for form.values and field.name
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [fileData, setFileData] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event && event.target && event.target.files) {
      event.preventDefault(); // make sure the form isn't submitted as well

      const fileInfo = event.target.files[0];
      setFileInfo(fileInfo);

      // make sure formik sees this as well
      setFieldValue(field.name, fileInfo);

      // load the file and show preview if image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result);
      };
      reader.readAsDataURL(fileInfo);
    }
  };

  return (
    <section className="container-fluid">
      <input
        id="fileUpload"
        name="fileUpload"
        className="form-control-file"
        type="file"
        accept="image/*"
        multiple={false}
        onChange={handleFileUpload}
      />
      {fileInfo && (
        <>
          <aside className="mt-2">
            <div key={fileInfo.name}>
              <div>
                <img className="img-thumbnail" src={fileData} alt={fileInfo.name} />
              </div>
            </div>
          </aside>
          <small>
            <ul className="list-unstyled mt-2">
              <li>{`Filename: ${fileInfo.name}`}</li>
              <li>{`Type: ${fileInfo.type}`}</li>
              <li>{`Size: ${fileInfo.size} bytes`}</li>
            </ul>
          </small>
        </>
      )}
    </section>
  );
}

export default MyUploadComponent;
