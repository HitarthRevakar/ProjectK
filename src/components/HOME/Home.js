
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';

import { useUserAuth } from "../../context/UserAuthContext";
import { useForm } from 'react-hook-form';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './home.css'
import questionsSet1 from '../QuestionPaper/Electrical.json';
import questionsSet2 from '../QuestionPaper/Instrumentation.json';
import { firestore, storage } from '../../firebase';




function Home() {
  const { logOut, user } = useUserAuth();
  let [userData, setUserData] = useState()
  let userData1 = localStorage.getItem("user");
  useEffect(()=>{
   debugger
    setUserData(JSON.parse(userData1))
  },[userData1])
 
  
  const [modal, setModal] = useState(false);
  const [submitted, setSubmitted] = useState(false)
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  let [testtypeError, setTesttypeError] = useState("")
  const [indexCount, setIndexCount] = useState(1);
  const lastIndex = useRef(1);
  const navigate = useNavigate();
  let imageRef = useRef();
  const {
    register,
    handleSubmit,
    getValues ,
    formState: { errors },
  } = useForm();

  const initialFormData = {
    contractor_name: '',
    trade: '',
    discipline: '',
    candidate_name: '',
    user_photo: null,
    id_number: '',
    contact: '',
    email: '',
    nationality: '',
    state: '',
    marital_status: '',
    dob: '',
    english_read: false,
    hindi_read: false,
    gujarati_read: false,
    others_read: false,
    english_write: false,
    hindi_write: false,
    gujarati_write: false,
    others_write: false,
    english_speak: 'no',
    hindi_speak: 'no',
    gujarati_speak: 'no',
    others_speak: 'no',
    academic_qualification: '',
    other_qualification: '',
    total_experience: '',
    company_name_1: '',
    designation_1: '',
    from_date_1: '',
    till_date_1: '',
    company_name_2: '',
    designation_2: '',
    from_date_2: '',
    till_date_2: '',
    company_name_3: '',
    designation_3: '',
    from_date_3: '',
    till_date_3: '',
    company_name_4: '',
    designation_4: '',
    from_date_4: '',
    till_date_4: '',
    company_name_5: '',
    designation_5: '',
    from_date_5: '',
    till_date_5: '',
    company_name_6: '',
    designation_6: '',
    from_date_6: '',
    till_date_6: '',
  };

  const [formData, setFormData] = useState(initialFormData);


  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.clear()
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  function displayUserPhoto(event) {
    const photo = event.target.files[0];

    if (photo) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setSelectedPhoto(e.target.result);
      };

      reader.readAsDataURL(photo);
    } else {
      setSelectedPhoto(null);
    }
  }

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
    setIsButtonVisible(false);
    const storageRef = storage.ref();
    const userPhotoRef = storageRef.child(`user_photos/${formData.user_photo[0].name}`);
    debugger
    if(selectedOption){
      try {

        await userPhotoRef.put(formData.user_photo[0]);
  
        // Get the download URL of the uploaded photo
        const downloadURL = await userPhotoRef.getDownloadURL();
        console.log('Download URL:', downloadURL);
  
        // Update the formData with the download URL
        formData.user_photo = downloadURL;
  
  
        firestore.collection('candidate-info').add(formData)
          .then((docRef) => {
            debugger
            toggle();
            console.log('Document written with ID: ', docRef.id);
          })
          .catch((error) => {
            debugger
            console.error('Error adding document: ', error);
          });
  
  
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
    setFormData(data)
    setModal(!modal)
  };

  const handleAddIndex = () => {
   
     lastIndex.current += 1;
      setIndexCount(lastIndex.current);

  };
  const handleClearIndex = () => {
    lastIndex.current -= 1;
    setIndexCount(lastIndex.current);
  };
  return (
    <div className="container my-3">
      <div className='navbar bg-body-tertiary  d-flex justify-content-between  py-2 px-3 '>
        
        <span className='fs-5'>Welcome,&nbsp;<i className="bi bi-person-circle text-secondary "></i>&nbsp;<span className='text-success fw-bold text-decoration-underline'>{user && user.firstName}</span></span>
        
        <button type="button" className="btn btn-info m-2">
                  <Link to={`/admin`} style={{ color: 'white', textDecoration: 'none' }}>
                    All Users
                  </Link>
                </button>
        
        <span><button className="btn btn-outline-danger px-3 rounded-0" onClick={handleLogout}>
          <i class="bi bi-box-arrow-in-left "></i>&nbsp;Log Out
        </button></span>
      </div>
      <div className='text-center'>

      </div>
      <form ref={imageRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="table-responsive" >
          <table className="table table-striped table-responsive">
            <tbody>
              <tr className='text-center align-items-center' style={{ height: "140px", backgroundColor: "white" }}>
                <td className="" colSpan="1">
                  <img src={process.env.PUBLIC_URL + '/logo.jpg'} style={{ border: "none" }} className='mt-2' alt="Logo" />
                </td>
                <td style={{ fontFamily: "Times New Roman", fontWeight: "bolder", color: "#0060B0" }} colSpan="2" className='mt-1 pt-2 align-items-center'>
                  <div className='align-items-center mt-5 '><h4 className='fw-bold'>TECHNO CONCEPTS INSTRUMENTS PRIVATE LIMITED VALIDATION CENTER, JAMNAGAR</h4>  </div>
                </td>
                <td colSpan="1">
                  <div className='my-3 img-fluid ' id="photo-container">
                    {selectedPhoto ? (
                      <img src={selectedPhoto} className='border-dark' alt="User Photo" width="160" height="160" />
                    ) : (
                      <div className='text-center align-items-center'><p>PHOTO</p></div>

                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td rowSpan="1" colSpan="1"><p className='mt-2'>CONTRACTOR NAME :</p> </td>
                <td rowSpan="1" colSpan="3" className="align-items-center">
                  <input
                    type="text"
                    name="contractor_name"
                    {...register('contractor_name', { required: true })}
                    className={`form-control ${errors.contractor_name ? 'error-input' : ''
                      }`}
                  />
                </td>
              </tr>
              <tr>
                <td rowSpan="1" colSpan="1"><p className='mt-2'>TRADE :</p> </td>
                <td rowSpan="1" colSpan="3" className="align-items-center">
                  <input
                    type="text"
                    name="trade"
                    className='form-control'
                  // {...register('trade', { required: true })}
                  // className={`form-control ${
                  //   errors.trade ? 'error-input' : ''
                  // }`}
                  />
                </td>
              </tr>
              <tr>
                <td rowSpan="1" colSpan="1"><p className='mt-2'>DISCIPLINE :</p> </td>
                <td rowSpan="1" colSpan="3" className="align-items-center">
                  <input
                    type="text"
                    name="discipline"
                    className='form-control'
                  // {...register('discipline', { required: true })}
                  // className={`form-control ${
                  //   errors.discipline ? 'error-input' : ''
                  // }`}
                  />
                </td>
              </tr>
              <tr>
                <td className="section-header" colSpan="4">
                  PERSONAL DETAILS:
                </td>
              </tr>
              <tr>
                <td rowSpan="1">CANDIDATE NAME:</td>
                <td rowSpan="1" className="align-items-center">
                  <input
                    type="text"
                    name="candidate_name"
                    {...register('candidate_name', { required: true })}
                    className={`form-control  ${errors.candidate_name ? 'error-input' : ''
                      }`}
                  />
                </td>
               <>
                  <td colSpan="1">UPLOAD PHOTO:</td>
                  <td colSpan="1">
                    <input
                      accept="image/*"
                      type="file"
                      name="user_photo"
                      {...register('user_photo', { required: true })}
                      className={`form-control ${errors.user_photo ? 'error-input' : ''
                        }`}
                      onChange={(e) => displayUserPhoto(e)}
                    />
                  </td></> 
              </tr>
              {/* Add more PERSONAL DETAILS fields here */}

              {/* CONTACT INFORMATION */}
              <tr>
                <td>I.D NUMBER <br />(ANY GOVT. APPROVED):</td>
                <td>
                  <input
                    type="text"
                    name="id_number"
                    {...register('id_number', { required: true })}
                    className={`form-control ${errors.id_number ? 'error-input' : ''
                      }`}
                  />
                </td>
                <td>CONTACT NO:</td>
                <td>
                  <input
                    type="text"
                    name="contact"
                    {...register('contact', { required: true })}
                    className={`form-control ${errors.contact ? 'error-input' : ''
                      }`}
                  />
                </td>
              </tr>
              {/* Add more CONTACT INFORMATION fields here */}

              {/* EMAIL, NATIONALITY, STATE */}
              <tr>
                <td>EMAIL ID:</td>
                <td>
                  <input
                    type="email"
                    name="email"
                    {...register('email', { required: true })}
                    className={`form-control ${errors.email ? 'error-input' : ''
                      }`}
                  />
                </td>
                <td>NATIONALITY:</td>
                <td>
                  <input
                    type="text"
                    name="nationality"
                    {...register('nationality', { required: true })}
                    className={`form-control ${errors.nationality ? 'error-input' : ''
                      }`}
                  />
                </td>
              </tr>
              <tr>
                <td>STATE:</td>
                <td>
                  <input
                    type="text"
                    name="state"
                    {...register('state', { required: true })}
                    className={`form-control ${errors.state ? 'error-input' : ''
                      }`}
                  />
                </td>
                <td>MARITAL STATUS:</td>
                <td>
                  <select
                    name="marital_status"
                    {...register('marital_status', { required: true })}
                    className={`form-select ${errors.marital_status ? 'error-input' : ''
                      }`}
                  >
                    <option value="">Select an option</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>DATE OF BIRTH:</td>
                <td>
                  <input
                    type="date"
                    name="dob"
                    {...register('dob', { required: true })}
                    className={`form-control ${errors.dob ? 'error-input' : ''
                      }`}
                  />
                </td>
              </tr>
              {/* Add more EMAIL, NATIONALITY, STATE fields here */}
            </tbody>
          </table>
        </div>

        {/* LANGUAGES KNOWN */}
        <table className="table table-responsive">

          <thead>

            <tr>
              <th colSpan="5">LANGUAGES KNOWN:</th>
            </tr>
            <tr>
              <th></th>
              <th>ENGLISH</th>
              <th>HINDI</th>
              <th>GUJARATI</th>
              <th>OTHERS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>READ</td>
              <td>
                <input
                  type="checkbox"
                  value="english"
                  name="read"
                  {...register('read', { required: true })}
                  className={` ${errors.read ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="language"
                  value="hindi"

                  {...register('read', { required: true })}
                  className={` ${errors.read ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  value="gujarati"
                  name="language"
                  {...register('read', { required: true })}
                  className={` ${errors.read ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  value="other"
                  name="language"
                  {...register('read', { required: true })}
                  className={` ${errors.read ? 'error-input' : ''
                    }`}
                />
              </td>
            </tr>
            {/* Add more LANGUAGES KNOWN fields here */}
          </tbody>
          <tbody>
            <tr>
              <td>WRITE</td>
              <td>
                <input
                  type="checkbox"
                  value="english"
                  name="language"
                  {...register('write', { required: true })}
                  className={` ${errors.write ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="language"
                  value="hindi"

                  {...register('write', { required: true })}
                  className={` ${errors.write ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  value="gujarati"
                  name="language"
                  {...register('write', { required: true })}
                  className={` ${errors.write ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  value="other"
                  name="language"
                  {...register('write', { required: true })}
                  className={` ${errors.write ? 'error-input' : ''
                    }`}
                />
              </td>
            </tr>
            {/* Add more LANGUAGES KNOWN fields here */}
          </tbody>
          <tbody>
            <tr>
              <td>SPEAK</td>
              <td>
                <input
                  type="checkbox"
                  value="english"
                  name="language"
                  {...register('speak', { required: true })}
                  className={` ${errors.speak ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="language"
                  value="hindi"

                  {...register('speak', { required: true })}
                  className={` ${errors.speak ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  value="gujarati"
                  name="language"
                  {...register('speak', { required: true })}
                  className={` ${errors.speak ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  value="other"
                  name="language"
                  {...register('speak', { required: true })}
                  className={` ${errors.speak ? 'error-input' : ''
                    }`}
                />
              </td>
            </tr>
            {/* Add more LANGUAGES KNOWN fields here */}
          </tbody>
        </table>

        {/* EDUCATIONAL QUALIFICATION */}
        <table className="editable-table" colSpan="">
          <tbody>
            <tr>
              <td className="section-header" colSpan="2">
                EDUCATIONAL QUALIFICATION:
              </td>
            </tr>
            <tr>
              <td className="sub-header">ACADEMIC:</td>
              <td>
                <input
                  type="text"
                  name="academic_qualification"
                  {...register('academic_qualification', { required: true })}
                  className={`form-control ${errors.academic_qualification ? 'error-input' : ''
                    }`}
                />
              </td>
            </tr>
            <tr>
              <td>OTHERS:</td>
              <td>
                <input
                  type="text"
                  name="other_qualification"
                  {...register('other_qualification')}

                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* EXPERIENCE DETAILS */}
        <table className="editable-table">
          <colgroup width="116"></colgroup>
          <colgroup width="150"></colgroup>
          <colgroup width="133"></colgroup>
          <tbody>
            <tr>
              <td className="section-header" colSpan="3">
                EXPERIENCE DETAILS:
              </td>
            </tr>
            <tr>
              <td>TOTAL YEARS OF EXPERIENCE:</td>
              <td colSpan="2">
                <input
                  type="text"
                  name="total_experience"
                  {...register('total_experience', { required: true })}
                  className={`form-control ${errors.total_experience ? 'error-input' : ''
                    }`}
                />
              </td>
            </tr>
            {/* Add more EXPERIENCE DETAILS fields here */}
          </tbody>
        </table>

        {/* TABLE FOR COMPANY DETAILS */}
        <table className="table GeneratedTable">
          <thead>
            <tr>
              <th>NAME OF THE COMPANY</th>
              <th>DESIGNATION</th>
              <th>FROM</th>
              <th>TILL</th>
              <th></th>
              <th><button type="button" className='btn btn-primary ml-5'  onClick={handleAddIndex}>Add +</button></th>
            </tr>
          </thead>

          <tbody>
            {[...Array(indexCount)].map((_, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name={`company_name_${index}`}
                    {...register(`company_name_${index}`)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name={`designation_${index}`}
                    {...register(`designation_${index}`)}
                  />
                </td>
                <td>
                  <center>
                    <input
                      type="date"
                      name={`from_date_${index}`}
                      {...register(`from_date_${index}`)}
                    />
                  </center>
                </td>
                <td>
                  <center>
                    <input
                      type="date"
                      name={`till_date_${index}`}
                      {...register(`till_date_${index}`)}
                    />
                  </center>
                  
                </td>
                <td>
                {isButtonVisible && (
                <button type="button" className='mt-1 btn btn-primary ml-5' 
                onClick={() => {
                  
                  const companyName = getValues(`company_name_${index}`);
                  const designation = getValues(`designation_${index}`);
                  const from_date = getValues(`from_date_${index}`);
                  const till_date = getValues(`till_date_${index}`);
                  debugger
                  if (companyName && designation && from_date) {
                    debugger
                    handleAddIndex();
                  }
                }}
                >Add +</button>
                 )}
                </td>
                <td>
                {isButtonVisible && (
                <button type="button" className='mt-1 btn btn-danger'  onClick={handleClearIndex}>Clear</button>
                 )}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        {/* FOR OFFICE USE */}
        <table>
          <tbody>
            <tr>
              <td>FOR OFFICE USE:</td>
              <td>CANDIDATE VERIFIED AND SCREENED BY:</td>
            </tr>
          </tbody>
        </table>
        {/* SUBMIT BUTTON */}
        <div className='d-flex justify-content-center w-100 '><button type="submit" className="btn btn-outline-secondary shadow border-1 rounded-2 px-4 py-2">
          Submit <span class="bi bi-send"></span>
        </button></div>
        <Modal isOpen={modal} toggle={toggle}>
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
                 
                  className={` form-check-input`}
                />
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
                 
                  className={`form-check-input`}
                />
                <label className="form-check-label" htmlFor="option2">
                  Instrumentation
                </label>
              </div>
            </div>
            {testtypeError ? <small style={{ color:"red"}}>{testtypeError}</small>:<></>}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className='rounned-0'
              
              onClick={() => {
                
                handleGeneratePDF();
                setSubmitted(true)
              }}
             
            // Disable the button when no option is selected
            >
              Submit
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </form>

      <div class="container my-4 text-start">
        <h4>NOTE:</h4>
        <ul>
          <li>CANDIDATE SHOULD REPORT WITH BASIC PPE'S</li>
          <li>ATTACH ALL RELEVANT EDUCATIONAL AND EXPERIENCE CERTIFICATES WITH THIS FORM</li>
          <li>CANDIDATE ARE REQUESTED TO STAY WITHIN THE SITE PREMISES FOR THE WHOLE DAY</li>
        </ul>
      </div>

    </div>

  );
}

export default Home;
