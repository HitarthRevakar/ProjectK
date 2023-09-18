import React, { useEffect, useState, useRef } from 'react';
import { firestore, storage } from '../../firebase';
import { Link } from 'react-router-dom';
import '../ADMIN/Admin.css';
import {Row , Col} from 'reactstrap'

const AdminApp = () => {
  const [forms, setForms] = useState([]);
  let searchTxtRef = useRef()
  const searchUser = async () =>{
    let searchTxt = searchTxtRef.current.value;
    // Reference the "forms" collection in Firestore
    const formsRef = firestore.collection('candidate-info');

    // Fetch the documents in the "forms" collection
    const snapshot = await formsRef.get();

    // Map the documents to an array of data
    const formsData = snapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Data inside the document
    }));
    let newForms = formsData.filter(form =>form?.contractor_name?.includes(searchTxt) || form.candidate_name.includes(searchTxt) || form.email.includes(searchTxt))
    debugger
    setForms(newForms)
    debugger
    
  }
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
        debugger

        // // add images of candidates in admin below code is code to get the images from firebase 
        // const storageRef = storage.ref();
        // const userPhotoRef = storageRef.child(`user_photos/${formsData.user_photo[0].name}`);

        // await userPhotoRef.put(formsData.user_photo[0]);

        // // Get the download URL of the uploaded photo
        // const downloadURL = await userPhotoRef.getDownloadURL();
        // console.log('Download URL:', downloadURL);

        // // Update the formData with the download URL
        // formsData.user_photo = downloadURL;

      } catch (error) {
        console.error('Error fetching forms: ', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  const fetchData1 = async () => {
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
      debugger
      searchTxtRef.current.value = ""
      // // add images of candidates in admin below code is code to get the images from firebase 
      // const storageRef = storage.ref();
      // const userPhotoRef = storageRef.child(`user_photos/${formsData.user_photo[0].name}`);

      // await userPhotoRef.put(formsData.user_photo[0]);

      // // Get the download URL of the uploaded photo
      // const downloadURL = await userPhotoRef.getDownloadURL();
      // console.log('Download URL:', downloadURL);

      // // Update the formData with the download URL
      // formsData.user_photo = downloadURL;

    } catch (error) {
      console.error('Error fetching forms: ', error);
    }
  };


  return (
    <>

      <div className='my-4'>
        <div className="container">
          <Row>
          <div className='text-center my-5'>
            <h1>List Of Registered Forms</h1>
          </div>
          </Row>
          <Row className='d-flex justify-content-between'>
          <Col xl="1">
          <button type="button" className="btn btn-info m-2">
                  <Link to={`/home`} style={{ color: 'white', textDecoration: 'none' }}>
                    Home
                    </Link>
                </button>
          </Col>
         <Col xl="4" className='mt-1 d-flex'>
          <input ref={searchTxtRef} placeholder='Search user by name,email...' className='form-control' />
          <button type="button" onClick={searchUser} className="btn btn-info m-2 text-white">
                  Search
                </button>
                <button type="button" onClick={fetchData1} className="btn btn-secondary m-2 text-white">
                  Clear
                </button>
         </Col>
          </Row>
       

          <table className="table m-3">
  <thead>
    <tr className='col-lg-4 col-md-4 col-sm-4 col-5 text-start '>
      <th className='text-danger fw-bold fs-4'>ID Number</th>
      <th className='text-danger fw-bold fs-4'>Candidate Name</th>
      <th className='text-danger fw-bold fs-4'>Email</th>
      <th className='text-danger fw-bold fs-4'></th>
    </tr>
  </thead>
  <tbody>
    {forms.map((form) => (
      <tr key={form.id}>
        <td>{form.id_number}</td>
        <td>{form.candidate_name}</td>
        <td>{form.email}</td>
       
        <td>
        {!form.marksId?
          <button type="button" className="btn btn-primary">
            <Link to={`/edit/${form.id}`} style={{ color: 'white', textDecoration: 'none' }}>
              Start Evaluation
            </Link>
          </button>
          
          :<>
           <button type="button" className="btn btn-success">
            <Link to={`/edit/${form.id}`} style={{ color: 'white', textDecoration: 'none' }}>
              Edit Evaluation
            </Link>
          </button>
          </>
        }
        </td>
      </tr>
    ))}
  </tbody>
</table>


        </div>
      </div>

    </>


  );
};

export default AdminApp;
