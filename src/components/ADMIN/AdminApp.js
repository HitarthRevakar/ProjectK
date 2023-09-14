import React, { useEffect, useState } from 'react';
import { firestore, storage } from '../../firebase';
import { Link } from 'react-router-dom';
import '../ADMIN/Admin.css';

const AdminApp = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    // Use a useEffect hook to fetch data when the component mounts
    const fetchData = async () => {
      try {
        // Reference the "forms" collection in Firestore
        const formsRef = firestore.collection('candidate-info');

        // Fetch the documents in the "forms" collection
        const snapshot = await formsRef.get();

        // Map the documents to an array of data
        const formsData = snapshot.docs.map((doc) => ({
          id: doc.id, // Document ID
          ...doc.data(), // Data inside the document
        }));
debugger
        // Set the forms state with the fetched data
        setForms(formsData);
        const user = formsData.filter(user => user.email == "kartikgupta1805@gmail.com")
        console.log(user)

        // add images of candidates in admin below code is code to get the images from firebase 
        const storageRef = storage.ref();
        const userPhotoRef = storageRef.child(`user_photos/${formsData.user_photo[0].name}`);
      
        await userPhotoRef.put(formsData.user_photo[0]);
      
        // Get the download URL of the uploaded photo
        const downloadURL = await userPhotoRef.getDownloadURL();
        console.log('Download URL:', downloadURL);
      
        // Update the formData with the download URL
        formsData.user_photo = downloadURL;

      } catch (error) {
        console.error('Error fetching forms: ', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);




  return (
  <>
      
      <div className='my-4'>
        <div className="container">
          <div className='text-center my-5'>
            <h1>List Of Registered Forms</h1>
          </div>

          <div className='d-flex'>
            <div className='col-lg-4 col-md-4 text-center my-2' >
              <h4 className='text-danger fw-bold'>ID Number</h4>
            </div>
            <div className='col-lg-4 col-md-4 text-center' >
              <h4 className='text-danger fw-bold'>Candidate Name</h4>
            </div>
            <div className='col-lg-4 col-md-4 text-center' >
              <h4 className='text-danger fw-bold'>Email</h4>
            </div>
          </div>
          
          {forms.map((form) => (
            <div className='d-flex' key={form.id}>
              <div className='col-lg-4 col-md-4'>
                <Link to={`/edit/${form.id}`} className=" text-decoration-none">
                  <p className='border-bottom text-dark'>{form.id_number}</p>
                </Link>
              </div>
              <div className='col-lg-4 col-md-4'>
                <Link to={`/edit/${form.id}`} className=" text-decoration-none">
                  <p className='border-bottom text-dark'>{form.candidate_name}</p>
                </Link>
              </div>
              <div className='col-lg-4 col-md-4'>
                <Link to={`/edit/${form.id}`} className=" text-decoration-none">
                  <p className='border-bottom text-dark'>{form.email}</p>
                </Link>
              </div>       
            </div>
          ))}

        </div>
      </div>

  </>

   
  );
};

export default AdminApp;
