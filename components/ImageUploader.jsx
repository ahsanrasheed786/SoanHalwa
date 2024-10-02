// // components/ImageUploader.jsx
// import { useState } from 'react';

// const ImageUploader = () => {
//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (event) => {
//     setImages(event.target.files);
//   };

//   const handleUpload = async () => {
//     setUploading(true);
//     setMessage('');

//     const formData = new FormData();
//     for (let i = 0; i < images.length; i++) {
//       formData.append('images', images[i]);
//     }

//     try {
//       const response = await fetch('/api/imageuploader', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       console.log(data)
//       if (response.ok) {
//         setMessage(data.message);

//         // You can also store the image URLs if needed
//       } else {
//         setMessage(data.message || 'Upload failed');
//       }
//     } catch (error) {
//       setMessage('An error occurred while uploading images');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <input type="file" multiple onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? 'Uploading...' : 'Upload Images'}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ImageUploader;


// components/ImageUploader.jsx
// import { useState } from 'react';

// const ImageUploader = () => {
//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (event) => {
//     setImages(event.target.files); // Access the selected files
//   };

//   const handleUpload = async () => {
//     setUploading(true);
//     setMessage('');

//     const formData = new FormData();
//     for (let i = 0; i < images.length; i++) {
//       formData.append('images', images[i]); // Append each file to FormData
//     }

//     try {
//       const response = await fetch('/api/imageuploader', { // Ensure the URL matches your route
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       console.log(data);
//       if (response.ok) {
//         setMessage(data.message); // Set success message
//       } else {
//         setMessage(data.message || 'Upload failed'); // Handle errors
//       }
//     } catch (error) {
//       setMessage('An error occurred while uploading images');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <input type="file" multiple onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? 'Uploading...' : 'Upload Images'}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ImageUploader;
/*************  ✨ Codeium Command ⭐  *************/
// components/ImageUploader.jsx
// import { useState } from 'react';

// const ImageUploader = () => {
//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (event) => {
//     setImages(event.target.files); // Access the selected files
//   };

//   const handleUpload = async () => {
//     setUploading(true);
//     setMessage('');

//     const formData = new FormData();
//     for (let i = 0; i < images.length; i++) {
//       formData.append('images', images[i]); // Append each file to FormData
//     }

//     try {
//       const response = await fetch('/app/api/imageuploader/route.js', { // Ensure the URL matches your route
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       console.log(data);
//       if (response.ok) {
//         setMessage(data.message); // Set success message
//       } else {
//         setMessage(data.message || 'Upload failed'); // Handle errors
//       }
//     } catch (error) {
//       setMessage('An error occurred while uploading images');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <input type="file" multiple onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? 'Uploading...' : 'Upload Images'}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ImageUploader;
/******  1170830b-1b82-4105-ac22-f6644a4b644a  *******/

// components/ImageUploader.js
// !1st 
// import { useState } from 'react';

// const ImageUploader = () => {
//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleUpload = async () => {
//     setUploading(true);
//     const formData = new FormData();
//     images.forEach(image => {
//       formData.append('files', image);
//     });

//     try {
//       const response = await fetch('/api/imageuploader', {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();
//       console.log('Upload successful:', data);
//     } catch (error) {
//       console.error('Upload failed:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <input type="file" multiple onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? 'Uploading...' : 'Upload Images'}
//       </button>
//     </div>
//   );
// };

// export default ImageUploader;
// 2econd!!


import { useState } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setImages(event.target.files);
  };

  const handleUpload = async () => {
    setUploading(true);
    setMessage('');

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('files', images[i]); // 'files' key must match multer key in the backend
    }

    try {
      const response = await fetch('/api/imageuploader', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Upload failed');
      }
    } catch (error) {
      setMessage('An error occurred while uploading images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Images'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImageUploader;
