import React, { useEffect, useState, useRef } from 'react';
import { firestore, storage } from '../../firebase';
import { Link ,useNavigate} from 'react-router-dom';
import '../ADMIN/Admin.css';
import {Row , Col} from 'reactstrap'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import questionsSet1 from '../QuestionPaper/Electrical.json';
import questionsSet2 from '../QuestionPaper/Instrumentation.json';
const AdminApp = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentFormId, setCurrentFormId] = useState(null); // State to store the current form ID
  const handleStartEvaluationClick = (formId) => {
    onSubmit();
    setCurrentFormId(formId); // Set the current form ID in the state
    setModal(true); // Open the modal
  };
  let [testtypeError, setTesttypeError] = useState("")
  let imageRef = useRef();
  const [submitted, setSubmitted] = useState(false)
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
    let newForms = formsData.filter(form =>form?.contractor_name?.includes(searchTxt) || form?.discipline?.includes(searchTxt) || form.candidate_name.includes(searchTxt) || form.email.includes(searchTxt))
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


  const [selectedOption, setSelectedOption] = useState(null);

  const handleRadioChange = (e) => {
    debugger
    setTesttypeError("")
    setSelectedOption(e.target.value);
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };


  const handleGeneratePDF = async () => {
    // Upload the user's photo to Firebase Storage
   
    // const storageRef = storage.ref();
    // const userPhotoRef = storageRef.child(`user_photos/${formData.user_photo[0].name}`);
    debugger
    if(selectedOption){
      try {

        // await userPhotoRef.put(formData.user_photo[0]);
  
        // // Get the download URL of the uploaded photo
        // const downloadURL = await userPhotoRef.getDownloadURL();
        // console.log('Download URL:', downloadURL);
  
        // // Update the formData with the download URL
        // formData.user_photo = downloadURL;
  
  
        // firestore.collection('candidate-info').add(formData)
        //   .then((docRef) => {
        //     debugger
        //     toggle();
        //     console.log('Document written with ID: ', docRef.id);
        //   })
        //   .catch((error) => {
        //     debugger
        //     console.error('Error adding document: ', error);
        //   });
  
  
        // Create a new jsPDF instance
        const pdf = new jsPDF({
          unit: 'mm',
          format: 'a4',
        });
        pdf.setFontSize(10);
  
        // Assuming imageRef.current is correctly defined

  
        const canvas = await html2canvas(imageRef.current);
  
          // const imageSrc = canvas.toDataURL('image/png');
          // pdf.addImage(imageSrc, 'PNG', 10, 10, 190, 270);
  
          // // Add a new page for the questions
          // pdf.addPage();
  
        // Assuming question is correctly defined and selectedOption is set
        debugger
        const questions = selectedOption === 'electrical' ? shuffleArray(questionsSet1) : shuffleArray(questionsSet2);
        let currentYPosition = 10;  // Initialize Y-coordinate for the new page
  
        questions.forEach((q, index) => {
          // Check if we need to add a new page
          if (currentYPosition > 270) { // Check if Y-coordinate is beyond page's limit
            pdf.addPage();
            currentYPosition = 10; // Reset Y-coordinate for the new page
          }
          // testing
          pdf.text(`Question ${index + 1}: ${q.question}`, 10, currentYPosition);
          currentYPosition += 10;
          if(q.a || q.b || q.c || q.d){
            pdf.text(`A) ${q.a}`, 10, currentYPosition);
            currentYPosition += 10;
    
            pdf.text(`B) ${q.b}`, 10, currentYPosition);
            currentYPosition += 10;
    
            pdf.text(`C) ${q.c}`, 10, currentYPosition);
            currentYPosition += 10;
            pdf.text(`D) ${q.d}`, 10, currentYPosition);
            currentYPosition += 20;  // Add more space before the next question
          } else {
            pdf.text(`Ans:`, 10, currentYPosition)
            currentYPosition += 60
          }
      
  
         
        });
  
        pdf.save('generated.pdf');
        debugger
        setSubmitted(false)
      } catch (error) { 
        console.error('An error occurred:', error);
        alert('An error occurred while generating the PDF. Please try again.');
      }
    } else {
      setTesttypeError("Please select a examination type to continue!")
    }
   
  };

  // for submit buton
  const toggle = () => setModal(!modal);

  const onSubmit = async (data) => {
    // Handle form submission
    console.log(data);
    // setFormData(data)
    setModal(!modal)
    
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
          <><button type="button" className="btn btn-primary" ref={imageRef}  onClick={() => handleStartEvaluationClick(form.id)}>
              {/* <Link to={`/edit/${form.id}`} style={{ color: 'white', textDecoration: 'none' }}> */}
                Start Evaluation
              {/* </Link> */}
            </button><Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>MCQ Examination Test</ModalHeader>
                <ModalBody>
                  <p className='mb-3'>
                    <span className="text-danger">Please Select Your Examination Subject Carefully*</span>
                  </p>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        required
                        type="radio"
                        id="option1"
                        onClick={handleRadioChange}
                        value="electrical"
                        name="test_type"

                        className={` form-check-input`} />
                      <label className="form-check-label" htmlFor="option1">
                        Electrical
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        required
                        type="radio"
                        id="option2"
                        value="instrumentation"
                        name="test_type"
                        onClick={handleRadioChange}

                        className={`form-check-input`} />
                      <label className="form-check-label" htmlFor="option2">
                        Instrumentation
                      </label>
                    </div>
                  </div>
                  {testtypeError ? <small style={{ color: "red" }}>{testtypeError}</small> : <></>}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    className='rounned-0'

                    onClick={() => {
                      handleGeneratePDF();
                      setSubmitted(true);
                      navigate(`/edit/${currentFormId}`);
                    } }

                  >
                    Submit
                  </Button>
                  <Button color="secondary" onClick={toggle}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal></>
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
