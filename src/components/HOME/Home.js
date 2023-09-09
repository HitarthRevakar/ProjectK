import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { useForm } from 'react-hook-form';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './home.css' 
import { firestore, storage } from '../../firebase';



function Home() {
  const { logOut, user } = useUserAuth();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  let imageRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const initialFormData = {
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
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

 
  function shuffleArray(array) {
    let newQuestions = []
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      newQuestions.push(array[j]);
      if(newQuestions.length > 9){
        return newQuestions
      }
    }
  }
  const handleGeneratePDF = async () => {
    try {
      debugger
      // Upload the user's photo to Firebase Storage
      const storageRef = storage.ref();
      const userPhotoRef = storageRef.child(`user_photos/${formData.user_photo[0].name}`);
  debugger
      await userPhotoRef.put(formData.user_photo[0]);
  debugger
      // Get the download URL of the uploaded photo
      const downloadURL = await userPhotoRef.getDownloadURL();
      console.log('Download URL:', downloadURL);
  debugger
      // Update the formData with the download URL
      formData.user_photo = downloadURL;
  
      // Store the user's data, including the photo URL, in Firestore
      await firestore.collection('candidate-info').add(formData);
  
      // Now you can proceed with generating the PDF
      const pdf = new jsPDF();
      const imgWidth = 180; // Adjust the image width as needed
    const imgHeight = 250; // Adjust the image height as needed

    // Assuming formData.user_photo contains the download URL of the image

debugger
// const encodedUrl = downloadURL.replace('/user_photos/', '/user_photos%2F');
    // Load the image using jsPDF's addImage method
    const element = imageRef.current;

    // Use html2canvas to capture the element as an image
    await html2canvas(element).then((canvas) => {
      // Convert the canvas to a data URL
      const imageSrc = canvas.toDataURL('image/png');
      pdf.addImage(imageSrc, 'JPG', 7, 10, imgWidth, imgHeight);
      pdf.addPage();
      // You can now use `imageSrc` as the source for an <img> tag or do other operations (e.g., save it to the server).
    });
      let formattedText = '';
      let questions = [
        {
          question: "What is the SI unit of electric current?",
          a: "Ampere (A)",
          b: "Volt (V)",
          c: "Ohm (Ω)",
          d: "Watt (W)",
        },
        {
          question: "What is the term for the opposition to the flow of electric current in a circuit?",
          a: "Resistance",
          b: "Voltage",
          c: "Current",
          d: "Conductance",
        },
        {
          question: "What is the unit of electrical resistance?",
          a: "Ohm (Ω)",
          b: "Farad (F)",
          c: "Hertz (Hz)",
          d: "Newton (N)",
        },
        {
          question: "Which component is used to store electrical energy in a circuit?",
          a: "Capacitor",
          b: "Inductor",
          c: "Resistor",
          d: "Transistor",
        },
        {
          question: "What does DC stand for in electrical terms?",
          a: "Direct Current",
          b: "Digital Circuit",
          c: "Dynamic Capacitance",
          d: "Dual Conductor",
        },
        {
          question: "What is the formula for Ohm's Law?",
          a: "V = IR",
          b: "P = VI",
          c: "R = VI",
          d: "I = VR",
        },
        {
          question: "Which type of motor is often used in household appliances like fans?",
          a: "Induction Motor",
          b: "Synchronous Motor",
          c: "DC Motor",
          d: "Stepper Motor",
        },
        {
          question: "What is the primary function of a transformer?",
          a: "To change voltage levels",
          b: "To rectify AC to DC",
          c: "To amplify electrical signals",
          d: "To generate electricity",
        },
        {
          question: "Which material is commonly used as an insulator in electrical wires?",
          a: "Rubber",
          b: "Copper",
          c: "Aluminum",
          d: "Silver",
        },
        {
          question: "What is the standard voltage for residential electrical outlets in most countries?",
          a: "110-120V",
          b: "220-240V",
          c: "12V",
          d: "480V",
        },
        {
          question: "Which semiconductor device is used for switching applications in electronic circuits?",
          a: "Transistor",
          b: "Resistor",
          c: "Capacitor",
          d: "Diode",
        },
        {
          question: "What does AC stand for in electrical terms?",
          a: "Alternating Current",
          b: "Amplified Circuit",
          c: "Analog Capacitance",
          d: "Active Conductor",
        },
        {
          question: "What is the fundamental unit of charge?",
          a: "Electron",
          b: "Proton",
          c: "Neutron",
          d: "Photon",
        },
        {
          question: "What is the process of producing a controlled electrical discharge through a gas called?",
          a: "Arcing",
          b: "Conduction",
          c: "Insulation",
          d: "Ionization",
        },
        {
          question: "Which law states that the total current entering a junction is equal to the total current leaving the junction in a closed circuit?",
          a: "Kirchhoff's Current Law",
          b: "Ohm's Law",
          c: "Faraday's Law",
          d: "Newton's Law",
        },
        {
          question: "What is the SI unit of electric charge?",
          a: "Coulomb (C)",
          b: "Volt (V)",
          c: "Ampere (A)",
          d: "Ohm (Ω)",
        },
        {
          question: "Which electrical component is used to store a small amount of energy for backup power?",
          a: "Supercapacitor",
          b: "Battery",
          c: "Resistor",
          d: "Transistor",
        },
        {
          question: "In electrical circuits, what does 'DC' mean?",
          a: "Direct Current",
          b: "Digital Circuit",
          c: "Dynamic Capacitance",
          d: "Dual Conductor",
        },
        {
          question: "What is the primary purpose of a diode in an electrical circuit?",
          a: "To allow current to flow in one direction only",
          b: "To amplify electrical signals",
          c: "To regulate voltage",
          d: "To store energy",
        },
      ];
      const selectedQuestions =     shuffleArray(questions);

// Select the first 10 questions

console.log(selectedQuestions)
      // Loop through the questions and format them into text
      selectedQuestions.forEach((q, index) => {
        formattedText += `${index + 1}. ${q.question}\n`;
        formattedText += `   a) ${q.a}\n`;
        formattedText += `   b) ${q.b}\n`;
        formattedText += `   c) ${q.c}\n`;
        formattedText += `   d) ${q.d}\n\n`;
      });
      // Add text content (questions and answers)
     

      pdf.setFontSize(12);
      pdf.text(formattedText, 10, 10); // Adjust the position as needed

      pdf.save('generated.pdf');

      // ... (rest of your PDF generation code)
    } catch (error) {
      console.error('Error uploading file or storing data:', error);
    }
  };
  

  const toggle = () => setModal(!modal);

  const onSubmit = async (data) => {
    // Handle form submission
    console.log(data);
    setFormData(data)
    

    setModal(!modal)
  };
  return (
    <div className="container my-5">
    <div className='navbar  d-flex justify-content-between  py-2 px-3 '>
            <span className='fs-5'>Welcome,&nbsp;<span className='text-success fw-bold text-decoration-underline'>{user && user.displayName}</span></span>
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
              {/* PERSONAL DETAILS */}
             
  
            </tbody>
          </table>
        </div>
        <div className="table-responsive" >
          <table className="table table-striped table-responsive">
            <tbody>
            <tr className='text-center align-items-center' style={{height:"150px", backgroundColor:"white"}}>
                <td className="section-header" colSpan="1">
                <img src={process.env.PUBLIC_URL + '/logo.jpg'} style={{border:"none"}}  className='img-fluid'  alt="Logo" />
                </td>
                <td style={{fontFamily:"Times New Roman", fontWeight:"bolder", color:"#0060B0"}} colSpan="2" className='mt-1 pt-2 align-items-center'>
               <div className='align-items-center mt-5 '> TECHNO CONCEPTS INSTRUMENTS PRIVATE LIMITED
VALIDATION CENTER, JAMNAGAR</div>
                </td>
                <td colSpan="1">
                <div className='mt-5'>
                PHOTO

                </div>
                </td>
              </tr>
              {/* PERSONAL DETAILS */}
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
                    {...register('candidate_name', { required: false })}
                    className={`form-control ${
                      errors.candidate_name ? 'error-input' : ''
                    }`}
                  />
                </td>
                <td colSpan={1}>UPLOAD PASSPORT SIZE PHOTO:</td>
                <td colSpan={1}>
                  <input
                    accept="image/*"
                    type="file"
                    name="user_photo"
                    {...register('user_photo', { required: false })}
                    className={`form-control ${
                      errors.user_photo ? 'error-input' : ''
                    }`}
                  />
                </td>
              </tr>
              {/* Add more PERSONAL DETAILS fields here */}

              {/* CONTACT INFORMATION */}
              <tr>
                <td>I.D NUMBER (GOVT APPROVED):</td>
                <td>
                  <input
                    type="text"
                    name="id_number"
                    {...register('id_number', { required: false })}
                    className={`form-control ${
                      errors.id_number ? 'error-input' : ''
                    }`}
                  />
                </td>
                <td>CONTACT NO:</td>
                <td>
                  <input
                    type="text"
                    name="contact"
                    {...register('contact', { required: false })}
                    className={`form-control ${
                      errors.contact ? 'error-input' : ''
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
                    {...register('email', { required: false })}
                    className={`form-control ${
                      errors.email ? 'error-input' : ''
                    }`}
                  />
                </td>
                <td>NATIONALITY:</td>
                <td>
                  <input
                    type="text"
                    name="nationality"
                    {...register('nationality', { required: false })}
                    className={`form-control ${
                      errors.nationality ? 'error-input' : ''
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
                    {...register('state', { required: false })}
                    className={`form-control ${
                      errors.state ? 'error-input' : ''
                    }`}
                  />
                </td>
                <td>MARITAL STATUS:</td>
                <td>
                  <select
                    name="marital_status"
                    {...register('marital_status', { required: false })}
                    className={`form-select ${
                      errors.marital_status ? 'error-input' : ''
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
                    {...register('dob', { required: false })}
                    className={`form-control ${
                      errors.dob ? 'error-input' : ''
                    }`}
                  />
                </td>
              </tr>
              {/* Add more EMAIL, NATIONALITY, STATE fields here */}
            </tbody>
          </table>
        </div>

        {/* LANGUAGES KNOWN */}
        <table className="table table-bordered">
        
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
                  name="language"
                  {...register('language', { required: false })}
                  className={` ${
                      errors.language ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="language"
                  value="hindi"

                  {...register('language', { required: false })}
                  className={` ${
                      errors.language ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  value="gujarati"
                  name="language"
                  {...register('language', { required: false })}
                  className={` ${
                      errors.language ? 'error-input' : ''
                    }`}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  value="other"
                  name="language"
                  {...register('language', { required: false })}
                  className={` ${
                      errors.language ? 'error-input' : ''
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
                  {...register('academic_qualification', { required: false })}
                  className={`form-control ${
                      errors.academic_qualification ? 'error-input' : ''
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
                  {...register('total_experience', { required: false })}
                  className={`form-control ${
                      errors.total_experience ? 'error-input' : ''
                    }`}
                />
              </td>
            </tr>
            {/* Add more EXPERIENCE DETAILS fields here */}
          </tbody>
        </table>

        {/* TABLE FOR COMPANY DETAILS */}
        <table className="GeneratedTable">
          <thead>
            <tr>
              <th>NAME OF THE COMPANY</th>
              <th>DESIGNATION</th>
              <th>FROM</th>
              <th>TILL</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((index) => (
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
        <div className='d-flex justify-content-center w-100'><button type="submit" className="btn btn-outline-primary rounded-0">
          Submit Form
        </button></div>
        <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>MCQ Examination Test</ModalHeader>
        <ModalBody>
      
        <p><span className='text-danger'>Please Select Your Examination Subject Carefully*</span></p><br/>
        <div className='d-flex gap-5'>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" />
                                <label class="form-check-label" for="exampleRadios1">
                                  Electrical
                                </label>
                              </div>
                              <div class="form-check">
                                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2"/>
                                <label class="form-check-label" for="exampleRadios2">
                                  Instrumentation
                                </label>
                              </div>
                          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => {toggle();handleGeneratePDF()}}>
            Submit
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
              
      </form>
    </div>

  );
}

export default Home;
