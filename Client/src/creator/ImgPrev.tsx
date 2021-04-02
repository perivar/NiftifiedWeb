import React, { useState } from 'react';
import placeholder from './placeholder.png';
import './ImgPrev.scss';

interface ImageSource {
  src: string;
  alt: string;
  fileObject: File | null;
}

const ImgPrev = () => {
  const [{ alt, src, fileObject }, setImg] = useState<ImageSource>({
    src: placeholder,
    alt: 'Upload an Image',
    fileObject: null
  });

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files && e.target.files[0]) {
      setImg({
        src: URL.createObjectURL(e.target.files[0]),
        alt: e.target.files[0].name,
        fileObject: e.target.files[0]
      });
    }
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    if (fileObject) {
      // Create an object of formData
      const formData = new FormData();

      // Update the formData object
      formData.append('image', fileObject, alt);

      // Details of the uploaded file
      console.log(fileObject);

      // Request made to the backend api
      // Send formData object
      // axios.post('api/uploadfile', formData);
    }
  };

  return (
    <form encType="multipart/form-data">
      <div className="form__img-input-container">
        <input type="file" accept=".png, .jpg, .jpeg" id="photo" className="visually-hidden" onChange={handleImg} />
        <label htmlFor="photo" className="form-img__file-label">
          <svg width="150" height="150" viewBox="0 0 15 15" xmlSpace="preserve" fill="#56ceef">
            <path
              d="M10.71,4L7.85,1.15C7.6555,0.9539,7.339,0.9526,7.1429,1.1471C7.1419,1.1481,7.141,1.149,7.14,1.15L4.29,4H1.5
						 C1.2239,4,1,4.2239,1,4.5v9C1,13.7761,1.2239,14,1.5,14h12c0.2761,0,0.5-0.2239,0.5-0.5v-9C14,4.2239,13.7761,4,13.5,4H10.71z
							M7.5,2.21L9.29,4H5.71L7.5,2.21z M13,13H2V5h11V13z M5,8C4.4477,8,4,7.5523,4,7s0.4477-1,1-1s1,0.4477,1,1S5.5523,8,5,8z M12,12
						 H4.5L6,9l1.25,2.5L9.5,7L12,12z"
            />
          </svg>
        </label>
        <img src={src} alt={alt} className="form-img__img-preview" />
      </div>
      <button type="button" className="btn btn-outline-primary" onClick={onFileUpload}>
        Upload
      </button>
    </form>
  );
};

export default ImgPrev;
