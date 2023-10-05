import React, { useEffect, useState, useRef } from 'react';
import { firestore, storage } from '../../firebase';
import firebase from '@firebase/app-compat';
import { AiOutlineDownload } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import '../ADMIN/Admin.css';
import { Row, Col } from 'reactstrap'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BsDownload } from "react-icons/bs";

import { useForm } from 'react-hook-form';
const AdminApp = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentFormId, setCurrentFormId] = useState(null);
  let [selectedUser, setSelectedUser] = useState()
  // State to store the current form ID
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle1 = () => setDropdownOpen((prevState) => !prevState);
  const handleStartEvaluationClick = (formId) => {
    debugger
    onSubmit();
    setCurrentFormId(formId); 

    // setTimeout(() => {
      

    // handleGeneratePDF();

    // }, 5000);
    
    navigate(`/edit/${formId}`);
    // Set the current form ID in the state
    // setModal(true); // Open the modal
  };
  let userReportRef = useRef()
  async function generatePDF() {
    const doc = new jsPDF();

    // Traverse the DOM elements within userReportRef and add them to the PDF
    const elementToCapture = document.getElementById('reportTable');
    await html2canvas(elementToCapture).then(canvas => {
      // Convert the canvas to an image data URL (base64)
      const imageDataURL = canvas.toDataURL('image/png');

      // You can display the captured image or perform further actions with it
      console.log(imageDataURL); // Print the image data URL

      doc.addImage(imageDataURL, 'PNG', 7, 10, 180, 240)
    
    });
    // You can adjust the position as needed

    // Save or display the PDF
    await doc.save("user_report.pdf");
    setTimeout(() => {
      setSelectedUser()



    }, 2000);
  }
  let [testtypeError, setTesttypeError] = useState("")
  let imageRef = useRef();
  const [submitted, setSubmitted] = useState(false)
  let searchTxtRef = useRef()
  let fromRef = useRef()
  let toRef = useRef()
  let gradeRef = useRef()
  let reportTypeRef = useRef()
  let trade = useRef()
  let disciplinedata = useRef()

  function jsonToTable(jsonData) {
    let table = '<table border="1">';
    let headers = Object.keys(jsonData[0]);

    // Create the table header row
    table += '<thead><tr>';
    headers.forEach(function (header) {
      table += '<th>' + header + '</th>';
    });
    table += '</tr></thead>';

    // Create the table body rows
    table += '<tbody>';
    jsonData.forEach(function (row) {
      table += '<tr>';
      headers.forEach(function (header) {
        table += '<td>' + row[header] + '</td>';
      });
      table += '</tr>';
    });
    table += '</tbody>';

    table += '</table>';
    return table;
  }

  useEffect(() => {
    if(selectedUser?.compentencyAssessment){
      let compentencyAssessment = JSON.parse(selectedUser.compentencyAssessment)
      for (const key in compentencyAssessment) {
        if (Object.hasOwnProperty.call(compentencyAssessment, key)) {
          const value = compentencyAssessment[key];
          setValue(key, value);
        }
      }
    }
   
  }, [selectedUser])

  async function downloadReport() {
    if (reportTypeRef.current.value == "Excel") {

      handleExportClick()
    } else if (reportTypeRef.current.value == "Pdf") {
      const filteredData = forms.map((item) => ({
        EP_No: item.id_number,
        Name: item.candidate_name,
        Number: item.contact,
        Email: item.email,
        Contractor: item.contractor_name,
        written_Test: item.writtenMarks,
        Oral_Test: item.oralMarks,
        practical_Test: item.practicalMarks,
        FinalRating: item.evaluation ? item.evaluation : 0,
        FinalScore: item.totalMarks,
        // EvaluatedDate: item.evaluatedDate?.toDate(),
        LastEvaluatedDate: item.lastEvaluatedDate?.toDate() ? item.lastEvaluatedDate?.toDate() : ""
      }));
      const htmlTable = await jsonToTable(filteredData);
      const parser = new DOMParser();

      // Parse the HTML string into a DOM document
      const doc = parser.parseFromString(htmlTable, 'text/html');

      // Extract the root element of the parsed document (in this case, a <div> element)
      const rootElement = doc.documentElement;
      debugger
      const pdf = new jsPDF();
      pdf.text('Report', 10, 60);
      // Create a canvas element


      // Append the canvas to the document or wherever you want to place it
      document.body.appendChild(rootElement);
      let imageSrc
      // Use html2canvas to convert the root element to a canvas
      await html2canvas(rootElement).then(function (canvas) {
        imageSrc = canvas.toDataURL('image/png');

        // Append the generated canvas to the document or do further actions with it
      });
      debugger


      // Add the image to the PDF with the new dimensions
      pdf.addImage(imageSrc, 'PNG', 7, -80, 200, 150);
      pdf.save('report.pdf');
      document.body.removeChild(rootElement);

    }

  }

  function exportToExcel(forms) {
    // Extract only the desired fields from each object in the data array
    const filteredData = forms.map((item) => ({
      EP_No: item.id_number,
      Name: item.candidate_name,
      Number: item.contact,
      Email: item.email,
      Contractor: item.contractor_name,
      written_Test: item.writtenMarks,
      Oral_Test: item.oralMarks,
      practical_Test: item.practicalMarks,
      FinalRating: item.evaluation ? item.evaluation : 0,
      FinalScore: item.totalMarks,
      LastEvaluatedDate: item.lastEvaluatedDate?.toDate() ? item.lastEvaluatedDate?.toDate() : ""
    }));
    const gradeCounts = filteredData.reduce((acc, curr) => {
      const grade = curr.FinalRating;
      if (grade) {
        if (!acc[grade]) {
          acc[grade] = 1;
        } else {
          acc[grade]++;
        }
      }
      return acc;
    }, {});

    console.log(gradeCounts);

    // Convert the filtered data to an Excel sheet
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Convert gradeCounts into an array of objects
    const gradeCountsArray = Object.entries(gradeCounts).map(([FinalRating, Count]) => ({ FinalRating, Count }));
    console.log(gradeCountsArray);

    // Create a new Excel workbook and add the sheets to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(gradeCountsArray), 'Grade Count');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, "user_data.xlsx");
  }

  const handleExportClick = () => {
    exportToExcel(forms);
  };


  const searchUser = async () => {

    try {
      const searchTxt = searchTxtRef.current.value;
      const formsRef = firestore.collection('candidate-info');
      const snapshot = await formsRef.get();
      const formsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let newForms = [...formsData];

      // Issue 1: Search filter by contractor_name
      if (searchTxt) {
        // Use a case-insensitive search by converting both the search text and contractor_name to lowercase
        const searchTxtLower = searchTxt.toLowerCase();
        newForms = newForms.filter((form) =>
          form?.contractor_name.toLowerCase().includes(searchTxtLower)
        );
      }

      // Issue 2: Filtering by fromDate
      const fromDate = new Date(fromRef.current.value);
      if (!isNaN(fromDate.getTime())) { // Check if fromDate is a valid Date
        const dateObject = new Date(fromDate);

        // Convert the JavaScript date to a Firebase Timestamp
        const seconds = Math.floor(dateObject.getTime() / 1000);
        const nanoseconds = (dateObject.getTime() % 1000) * 1000000;
        const firebaseTimestamp = new firebase.firestore.Timestamp(seconds, nanoseconds);
        // Correction: Convert dates to Firestore Timestamps for comparison
        newForms = newForms.filter(
          (form) => form?.createdDate.toDate() >= firebaseTimestamp.toDate()
        );

      }

      // Issue 3: Filtering by toDate
      const toDate = new Date(toRef.current.value);
      if (!isNaN(toDate.getTime())) { // Check if toDate is a valid Date
        const dateObject = new Date(toDate);

        // Convert the JavaScript date to a Firebase Timestamp
        const seconds = Math.floor(dateObject.getTime() / 1000);
        const nanoseconds = (dateObject.getTime() % 1000) * 1000000;
        const firebaseTimestamp = new firebase.firestore.Timestamp(seconds, nanoseconds);
        // Correction: Convert dates to Firestore Timestamps for comparison

        // Correction: Convert dates to Firestore Timestamps for comparison
        newForms = newForms.filter(
          (form) => form.createdDate.toDate() <= firebaseTimestamp.toDate()
        );
      }

      const grade = gradeRef.current.value
      debugger
      if (grade) {
        debugger
        newForms = newForms.filter(
          (form) => form.evaluation === grade
        );
        debugger
      }

      const tradedata = trade.current.value
      debugger
      if (tradedata){
        newForms = newForms.filter(
          (form) => form.trade === tradedata
        );
      }

      const selecteddisciplinedata = disciplinedata.current.value
      debugger
      if (selecteddisciplinedata)
      {
        newForms = newForms.filter(
          (form) => form.discipline === selecteddisciplinedata
        );
      }

      // Update the state with filtered data
      setForms(newForms);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


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

        // Set the forms state with the fetched data
        setForms(formsData);


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
      fromRef.current.value = null
      toRef.current.value = null
      gradeRef.current.value = ""
      trade.current.value =""
      disciplinedata.current.value = ""

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


  // const handleGeneratePDF = async () => {
  //   // Upload the user's photo to Firebase Storage

  //   // const storageRef = storage.ref();
  //   // const userPhotoRef = storageRef.child(`user_photos/${formData.user_photo[0].name}`);
  //   debugger
  //   // if (...selectedUser?.discipline) {
  //     debugger
  //     try {

  //       const pdf = new jsPDF({
  //         unit: 'mm',
  //         format: 'a4',
  //       });
  //       pdf.setFontSize(10);

  //       // Assuming imageRef.current is correctly defined


  //       const canvas = await html2canvas(imageRef.current);

       
  //       debugger
  //       const questions = selectedUser?.discipline === 'Electrical' ? shuffleArray(questionsSet1) : shuffleArray(questionsSet2);
  //       let currentYPosition = 10;  // Initialize Y-coordinate for the new page
  //       debugger
  //       questions.forEach((q, index) => {
  //         // Check if we need to add a new page
  //         if (currentYPosition > 270) { // Check if Y-coordinate is beyond page's limit
  //           pdf.addPage();
  //           currentYPosition = 10; // Reset Y-coordinate for the new page
  //         }
  //         // testing
  //         pdf.text(`Question ${index + 1}: ${q.question}`, 10, currentYPosition);
  //         currentYPosition += 10;
  //         if (q.a || q.b || q.c || q.d) {
  //           pdf.text(`A) ${q.a}`, 10, currentYPosition);
  //           currentYPosition += 10;

  //           pdf.text(`B) ${q.b}`, 10, currentYPosition);
  //           currentYPosition += 10;

  //           pdf.text(`C) ${q.c}`, 10, currentYPosition);
  //           currentYPosition += 10;
  //           pdf.text(`D) ${q.d}`, 10, currentYPosition);
  //           currentYPosition += 20;  // Add more space before the next question
  //         } else {
  //           pdf.text(`Ans:`, 10, currentYPosition)
  //           currentYPosition += 60
  //         }



  //       });

  //       pdf.save('generated.pdf');
  //       debugger
  //       setSubmitted(false)
  //     } catch (error) {
  //       console.error('An error occurred:', error);
  //       alert('An error occurred while generating the PDF. Please try again.');
  //     }
  //   // } else {
  //   //   setTesttypeError("Please select a examination type to continue!")
  //   // }

  // };

  // for submit buton
  const toggle = () => setModal(!modal);

  const onSubmit = async (data) => {
    // Handle form submission
    console.log(data);
    // setFormData(data)
    // setModal(!modal)

  };
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const handleTradeChange = (event) => {
    // event.preventDefault()
    setSelectedDiscipline(event.target.value); // Update the selected trade
  };
  const discipline = [
    "Electrical",
    "Instrumental"
  ]
  const Instrumentaltrade = [
    { trade: "INST-SUPERVISOR", mrcNo: "JG-I-PM-SU" },
    { trade: "INST-TECHNICIAN", mrcNo: "JG-I-PM-TE" },
    { trade: "INST-ELECTRICIAN", mrcNo: "JG-I-PM-EL" },
    { trade: "INST-FITTER", mrcNo: "JG-I-PM-FT" },

  ]
  const ElectricalInstrumentaltrade = [
    { trade: "ELEC-SUPERVISOR (ELECTRICAL MAINT, PM, CM, RM)", mrcNo: "JG-E-EM-SU" },
    { trade: "ELEC-SUPERVISOR (STREET LIGHTING, TESTING)", mrcNo: "JG-E-LT-SU" },
    { trade: "ELEC-SUPERVISOR (LV SWGR MAINTENANCE)", mrcNo: "JG-E-SS-SU" },
    { trade: "ELEC-SUPERVISOR (HV SWGR MAINT)", mrcNo: "JG-E-HS-SU" },
    { trade: "ELEC-SUPERVISOR (SUBSTATION ELECTRICAL MAINTENANCE)", mrcNo: "JG-E-SE-SU" },
    { trade: "ELEC-SUPERVISOR (LIGHTING MAINTENANCE)", mrcNo: "JG-E-LM-SU" },
    { trade: "ELEC-TECHNICIAN (ELECTRICAL MAINT, PM, CM, RM)", mrcNo: "JG-E-EM-TE" },
    { trade: "ELEC-TECHNICIAN (STREET LIGHTING, TESTING)", mrcNo: "JG-E-LT-TE" },
    { trade: "ELEC-TECHNICIAN (LV SWGR MAINTENANCE)", mrcNo: "JG-E-SS-TE" },
    { trade: "ELEC-TECHNICIAN (HV SWGR MAINT)", mrcNo: "JG-E-HS-TE" },
    { trade: "ELEC-TECHNICIAN (SUBSTATION ELECTRICAL MAINTENANCE)", mrcNo: "JG-E-SE-TE" },
    { trade: "ELEC-TECHNICIAN (LIGHTING MAINTENANCE)", mrcNo: "JG-E-LM-TE" }
  ]
  return (
    <>

      <div className='my-4 '>
        <div className="container mb-5">
          <Row>
            <div className='text-center my-4'>
              <h1>List of Users</h1>
            </div>
          </Row>
          <Row className='d-flex justify-content-between align-items-center'>
            <Col xl="1">
              <button type="button" className="btn btn-info mt-5 " style={{ marginLeft: "21px" }}>
                <Link to={`/home`} style={{ color: 'white', textDecoration: 'none' }}>
                  Home
                </Link>
              </button>
            </Col>
            <Col xl="2" className='mt-3'>
              <p>From</p>
              <input ref={fromRef} type='date' id='datepicker' className='form-control' />
            </Col>
            <Col xl="2" className='mt-3'>
              <p>To</p>
              <input ref={toRef} type='date' id='datepicker' className='form-control' />
            </Col>
            <Col xl="3" className='d-flex p-5 mt-5'>
              <select className='' ref={gradeRef}>
                <option value="">Select a Grade</option>
                <option value="Below">Below</option>
                <option value="Average">Average</option>
                <option value="Good">Good</option>
                <option value="Excellent">Excellent</option>
                <option value="Outstanding">Outstanding</option>
              </select>
            </Col>
            <Col xl="2" className='mt-5'>
              <input ref={searchTxtRef} placeholder='Enter contractor name' className='form-control' />
            </Col>
            <Col xl="12" className='d-flex justify-content-end'>
             
              <select color='secondary' onChange={handleTradeChange} style={{ width: "170px", height: "40px" }} className='mt-2 secondary rounded-1' ref={disciplinedata}>
                <option value="">Select a discipline</option>
                {discipline.map((discipline, index) => (
                      <option key={index} value={discipline}>
                        {discipline}
                      </option>
                    ))}
              </select>

              <select color='secondary' onChange={downloadReport} style={{ width: "170px", height: "40px" ,marginLeft:"20px"}} className='mt-2 secondary rounded-1' ref={trade}>
                <option value="">Select a trade</option>
                {selectedDiscipline === 'Electrical'
                      ? ElectricalInstrumentaltrade.map((trade, index) => (

                        <option key={index} value={trade.trade}>
                          {trade.trade}
                        </option>
                      ))
                      : selectedDiscipline === 'Instrumental'
                        ? Instrumentaltrade.map((trade, index) => (
                          <option key={index} value={trade.trade}>
                            {trade.trade}
                          </option>
                        ))
                        : null}
              </select>

              <select color='secondary' onChange={downloadReport} style={{ width: "170px", height: "40px" ,marginLeft:"20px" }} className='mt-2 secondary rounded-1' ref={reportTypeRef}>
                <option value="">Download report</option>
                <option value="Pdf">Pdf</option>
                <option value="Excel">Excel</option>
              </select> 
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
              <tr className='col-lg-12 col-md-12 col-sm-12 col-12 text-center'>
                <th className='text-danger fw-bold fs-4'>Sr No.</th>
                <th className='text-danger fw-bold fs-4'>Id No.</th>
                <th className='text-danger fw-bold fs-4'>Name</th>
                <th className='text-danger fw-bold fs-4'>Number</th>
                <th className='text-danger fw-bold fs-4'>Email</th>
                <th className='text-danger fw-bold fs-4'>Name of Contractor</th>
                <th className='text-danger fw-bold fs-4'>Grade Evaluation</th>
                <th className='text-danger fw-bold fs-4'>Report</th>
                <th className='text-danger fw-bold fs-4'></th>
              </tr>

            </thead>
            <tbody>
              {forms.map((form, index) => (
                <tr key={form.id}>
                  <td>{index + 1}</td>
                  <td>{form.id_number}</td>
                  <td>{form.candidate_name}</td>
                  <td>{form.contact}</td>
                  <td>{form.email}</td>
                  <td>{form.contractor_name}</td>
                  <td>{form.evaluation ? form.evaluation : ""}</td>
                  <td onClick={() => { setSelectedUser(form); debugger }}> <Button color="primary">
                    Report <BsDownload />
                  </Button></td>



                  <td>
                    {!form.marksId ?
                      <><button type="button" className="btn btn-primary" ref={imageRef} onClick={() => handleStartEvaluationClick(form.id) }>
                        {/* <Link to={`/edit/${form.id}`} style={{ color: 'white', textDecoration: 'none' }}> */}
                        Start Evaluation
                        {/* </Link> */}
                      </button>
                      {/* <Modal isOpen={modal} toggle={toggle}>
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
                              }}

                            >
                              Submit
                            </Button>
                            <Button color="secondary" onClick={toggle}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Modal> */}
                        </>
                      : <>
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
        {selectedUser ? <div style={{ marginTop: "420px" }}>
          <div ref={userReportRef} id='reportTable' className="custom-table custom-table table-responsive" style={{ width: "90%", margin: "0 auto" }} >
            <table style={{ border: "2px solid black" }} className="table table-striped custom-table table-responsive">
              <tbody>
                <tr className='text-center align-items-center' style={{ height: "140px", backgroundColor: "white" }}>
                  <td style={{ border: "2px solid black" }} className="" colSpan="1">
                    <img src={process.env.PUBLIC_URL + '/logo.jpg'} style={{ border: "none" }} className='mt-2' alt="Logo" />
                  </td>
                  <td style={{ fontFamily: "Times New Roman", fontWeight: "bolder", color: "#0060B0" }} colSpan="2" className='mt-1 pt-2 align-items-center'>
                    <div className='align-items-center mt-5 '><h4 className='fw-bold'>TECHNO CONCEPTS INSTRUMENTS PRIVATE LIMITED VALIDATION CENTER, JAMNAGAR</h4>  </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className='custom-table table-responsive'>
              <tr style={{ width: "100%" }} className='text-center align-items-center'>
                <td style={{ border: "2px solid black" }} colSpan="4" className='mt-1 align-items-center '>
                  <div className='align-items-center '><h4 className='fw-bold'>CANDIDATE VALIDATION AND ASSESSMENT REPORT</h4>  </div>
                </td>
              </tr>
              <tr className='text-center align-items-center'>
                {/* <td style={{ border: "2px solid black", width: "220px" }} rowSpan={6} class="box"> QR Code</td> */}
                <td >
                  <div className='h-100 w-100' style={{ margin: '0', padding: '0', width: "50%" }}>
                    <table className='fw-bold custom-table table-responsive' style={{ borderCollapse: "collapse", margin: '0', padding: '0' }}>
                      <tr>
                        <td style={{ border: '1px solid black' }}>CANDIDATE NAME:</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>TRADE:</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>DISCIPLINE:</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>ID NUMBER:</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>CONTRACTOR NAME:</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>DATE:</td>
                      </tr>
                    </table>
                  </div>
                </td>
                <td>
                  <div className='h-100 w-100' style={{ margin: '0', padding: '0', width: "50%" }}>

                    <table className='custom-table table-responsive' style={{ borderCollapse: "collapse", margin: '0', padding: '0' }}>
                      <tr>
                        <td style={{ border: '1px solid black', padding: "20px " }}>{selectedUser?.candidate_name}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>{selectedUser?.trade}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>{selectedUser?.discipline}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>{selectedUser?.id_number}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>{selectedUser?.contractor_name}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black' }}>
                          {selectedUser?.createdDate?.toDate() ? selectedUser.createdDate.toDate().toISOString().split('T')[0] : ''}
                        </td>

                      </tr>
                    </table>
                  </div>
                </td>
                <td style={{ border: "2px solid black", width: "220px" }} rowspan="5" class="box">
                  <img
                    // src='{selectedUser.user_photo}'
                    src={process.env.PUBLIC_URL + '/logo.jpg'}
                    alt="User Profile Photo"
                    className="w-50 img-fluid img-thumbnail user-photo my-3"
                    onLoad={generatePDF}
                  />
                </td>
              </tr>
            </table>
            <table className="table custom-table table-responsive mt-5">

              <thead>


                <tr>

                  <th>TEST CATEGORY</th>
                  <th>MARKS ALLOTED</th>
                  <th>MARKS OBTAINED</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>WRITTEN</td>
                  <td>
                    35
                  </td>
                  <td>
                    {selectedUser?.writtenMarks ? selectedUser?.writtenMarks : ""}

                  </td>

                </tr>
                {/* Add more LANGUAGES KNOWN fields here */}
              </tbody>
              <tbody>
                <tr>
                  <td>VIVA</td>
                  <td>
                    20
                  </td>
                  <td>
                    {selectedUser?.oralMarks ? selectedUser?.oralMarks : ""}

                  </td>

                </tr>
                {/* Add more LANGUAGES KNOWN fields here */}
              </tbody>
              <tbody>
                <tr>
                  <td>PRACTICAL</td>
                  <td>
                    40
                  </td>

                  <td>
                    {selectedUser?.practicalMarks ? selectedUser?.practicalMarks : ""}

                  </td>
                </tr>
                {/* Add more LANGUAGES KNOWN fields here */}
              </tbody>
              <tbody>
                <tr>
                  <td>TOTAL</td>
                  <td>
                    100
                  </td>
                  <td>
                    {selectedUser?.totalMarks ? selectedUser?.totalMarks : ""}

                  </td>

                </tr>
                {/* Add more LANGUAGES KNOWN fields here */}
              </tbody>
            </table>
            {selectedUser.discipline == "Electrical" ?  <table className="table custom-table table-responsive mt-5">
              <tr>
                <th>COMPETENCY ASSESSMENT:</th>
              </tr>
              <tr>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="pmOfLtMotors"
                    style={{ marginRight: '25px' }}
                    // {...register('pmOfLtMotors')}
                    checked={selectedUser.pmOfLtMotors}
                  />
                  PM OF LT MOTORS
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="pmOfSwitchGear"
                    style={{ marginRight: '25px' }}
                    // {...register('pmOfSwitchGear')}
                    checked={selectedUser.pmOfSwitchGear}
                  />
                  PM OF SWITCH GEAR
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="pmOfPP"
                    style={{ marginRight: '25px' }}
                    // {...register('pmOfPP')}
                    checked={selectedUser.pmOfPP}
                  />
                  PM OF PP
                </td>
              </tr>
              <tr>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="pmOfHtMotors"
                    style={{ marginRight: '25px' }}
                    // {...register('pmOfHtMotors')}
                    checked={selectedUser.pmOfHtMotors}
                  />
                  PM OF HT MOTORS
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="cmOfSwitchGear"
                    style={{ marginRight: '25px' }}
                    // {...register('cmOfSwitchGear')}
                    checked={selectedUser.cmOfSwitchGear}
                  />
                  CM OF SWITCH GEAR
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="pmOfLdb"
                    style={{ marginRight: '25px' }}
                    // {...register('pmOfLdb')}
                    checked={selectedUser.pmOfLdb}
                  />
                  PM OF LDB
                </td>
              </tr>
              <tr>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="cmOfLtMotors"
                    style={{ marginRight: '25px' }}
                    // {...register('cmOfLtMotors')}
                    checked={selectedUser.cmOfLtMotors}
                  />
                  CM OF LT MOTORS
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="pmOfPowerTransformer"
                    style={{ marginRight: '25px' }}
                    // {...register('pmOfPowerTransformer')}
                    checked={selectedUser.pmOfPowerTransformer}
                  />
                  PM OF POWER TRANSFORMER
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="meggering"
                    style={{ marginRight: '25px' }}
                    // {...register('meggering')}
                    checked={selectedUser.meggering}
                  />
                  MEGGERING
                </td>
              </tr>
              <tr>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="cmOfHtMotors"
                    style={{ marginRight: '25px' }}
                    // {...register('cmOfHtMotors')}
                    checked={selectedUser.cmOfHtMotors}
                  />
                  CM OF HT MOTORS
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="cmOfPowerTransformer"
                    style={{ marginRight: '25px' }}
                    // {...register('cmOfPowerTransformer')}
                    checked={selectedUser.cmOfPowerTransformer}
                  />
                  CM OF POWER TRANSFORMER
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="basicSafety"
                    style={{ marginRight: '25px' }}
                    // {...register('basicSafety')}
                    checked={selectedUser.basicSafety}
                  />
                  BASIC SAFETY
                </td>
              </tr>
              <tr>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="pmOfEarthPit"
                    style={{ marginRight: '25px' }}
                    // {...register('pmOfEarthPit')}
                    checked={selectedUser.pmOfEarthPit}
                  />
                  PM OF EARTH PIT
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="glandingAndTermination"
                    style={{ marginRight: '25px' }}
                    // {...register('glandingAndTermination')}
                    checked={selectedUser.glandingAndTermination}
                  />
                  GLANDING AND TERMINATION
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="tbraAndHitra"
                    style={{ marginRight: '25px' }}
                    // {...register('tbraAndHitra')}
                    checked={selectedUser.tbraAndHitra}
                  />
                  TBRA AND HITRA
                </td>
              </tr>
              <tr>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="cableLaying"
                    style={{ marginRight: '25px' }}
                    // {...register('cableLaying')}
                    checked={selectedUser.cableLaying}
                  />
                  CABLE LAYING
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="emergencyResponse"
                    style={{ marginRight: '25px' }}
                    // {...register('emergencyResponse')}
                    checked={selectedUser.emergencyResponse}
                  />
                  EMERGENCY RESPONSE
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="toolBoxTalk"
                    style={{ marginRight: '25px' }}
                    // {...register('toolBoxTalk')}
                    checked={selectedUser.toolBoxTalk}
                  />
                  TOOL BOX TALK
                </td>
              </tr>
              <tr>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="rolesAndResponsibilities"
                    style={{ marginRight: '25px' }}
                    // {...register('rolesAndResponsibilities')}
                    checked={selectedUser.rolesAndResponsibilities}
                  />
                  ROLES AND RESPONSIBILITIES
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="lprzt"
                    style={{ marginRight: '25px' }}

                    checked={selectedUser.lprzt}
                  />
                  LPRZT
                </td>
                <td scope="row">
                  <input
                    type="checkbox"
                    name="workPermitSystem"
                    style={{ marginRight: '25px' }}

                    checked={selectedUser.workPermitSystem}
                  />
                  WORK PERMIT SYSTEM
                </td>
              </tr>
            </table> :<table className="table custom-table table-responsive mt-5">
        <thead>
          <tr>
            <th>COMPETENCY ASSESSMENT:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="checkbox"
                name="temperatureMeasurement"
                style={{ marginRight: '25px' }}
                {...register('temperatureMeasurement')}
              />
              TEMPERATURE MEASUREMENT
            </td>
            <td>
              <input
                type="checkbox"
                name="pressureMeasurement"
                style={{ marginRight: '25px' }}
                {...register('pressureMeasurement')}
              />
              PRESSURE MEASUREMENT
            </td>
            <td>
              <input
                type="checkbox"
                name="levelMeasurement"
                style={{ marginRight: '25px' }}
                {...register('levelMeasurement')}
              />
              LEVEL MEASUREMENT
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="flowMeasurement"
                style={{ marginRight: '25px' }}
                {...register('flowMeasurement')}
              />
              FLOW MEASUREMENT
            </td>
            <td>
              <input
                type="checkbox"
                name="vibrationMeasurement"
                style={{ marginRight: '25px' }}
                {...register('vibrationMeasurement')}
              />
              VIBRATION MEASUREMENT
            </td>
            <td>
              <input
                type="checkbox"
                name="controlValve"
                style={{ marginRight: '25px' }}
                {...register('controlValve')}
              />
              CONTROL VALVE
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="onOffValve"
                style={{ marginRight: '25px' }}
                {...register('onOffValve')}
              />
              ON-OFF VALVE
            </td>
            <td>
              <input
                type="checkbox"
                name="switches"
                style={{ marginRight: '25px' }}
                {...register('switches')}
              />
              SWITCHES (TEMPERATURE, PRESSURE, LEVEL, AND FLOW)
            </td>
            <td>
              <input
                type="checkbox"
                name="openCloseLoopInterlock"
                style={{ marginRight: '25px' }}
                {...register('openCloseLoopInterlock')}
              />
              OPEN LOOP, CLOSE LOOP, AND INTERLOCK
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="tciCsiInstruments"
                style={{ marginRight: '25px' }}
                {...register('tciCsiInstruments')}
              />
              TCI AND CSI INSTRUMENTS
            </td>
            <td>
              <input
                type="checkbox"
                name="pid"
                style={{ marginRight: '25px' }}
                {...register('pid')}
              />
              P & ID
            </td>
            <td>
              <input
                type="checkbox"
                name="termination"
                style={{ marginRight: '25px' }}
                {...register('termination')}
              />
              TERMINATION
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="dcs"
                style={{ marginRight: '25px' }}
                {...register('dcs')}
              />
              DCS
            </td>
            <td>
              <input
                type="checkbox"
                name="plc"
                style={{ marginRight: '25px' }}
                {...register('plc')}
              />
              PLC
            </td>
            <td>
              <input
                type="checkbox"
                name="esd"
                style={{ marginRight: '25px' }}
                {...register('esd')}
              />
              ESD
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="mcms"
                style={{ marginRight: '25px' }}
                {...register('mcms')}
              />
              MCMS
            </td>
            <td>
              <input
                type="checkbox"
                name="irpMarshallingControlCabiner"
                style={{ marginRight: '25px' }}
                {...register('irpMarshallingControlCabiner')}
              />
              IRP, MARSHALLING, AND CONTROL CABINER
            </td>
            <td>
              <input
                type="checkbox"
                name="weighingSystem"
                style={{ marginRight: '25px' }}
                {...register('weighingSystem')}
              />
              WEIGHING SYSTEM
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="ppes"
                style={{ marginRight: '25px' }}
                {...register('ppes')}
              />
              PPE'S
            </td>
            <td>
              <input
                type="checkbox"
                name="analyser"
                style={{ marginRight: '25px' }}
                {...register('analyser')}
              />
              ANALYSER
            </td>
            <td>
              <input
                type="checkbox"
                name="instrumentationCables"
                style={{ marginRight: '25px' }}
                {...register('instrumentationCables')}
              />
              INSTRUMENTATION CABLES
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="atexCertification"
                style={{ marginRight: '25px' }}
                {...register('atexCertification')}
              />
              ATEX CERTIFICATION DEFINITION
            </td>
            <td>
              <input
                type="checkbox"
                name="dataSheet"
                style={{ marginRight: '25px' }}
                {...register('dataSheet')}
              />
              DATA SHEET
            </td>
            <td>
              <input
                type="checkbox"
                name="cableScheduleJbSchedule"
                style={{ marginRight: '25px' }}
                {...register('cableScheduleJbSchedule')}
              />
              CABLE SCHEDULE AND JB SCHEDULE
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="dryLoopWetLoopCheck"
                style={{ marginRight: '25px' }}
                {...register('dryLoopWetLoopCheck')}
              />
              DRY LOOP AND WET LOOP CHECK
            </td>
            <td>
              <input
                type="checkbox"
                name="llf"
                style={{ marginRight: '25px' }}
                {...register('llf')}
              />
              LLF
            </td>
            <td>
              <input
                type="checkbox"
                name="earthingGrounding"
                style={{ marginRight: '25px' }}
                {...register('earthingGrounding')}
              />
              EARTHING AND GROUNDING
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="tbraHitra"
                style={{ marginRight: '25px' }}
                {...register('tbraHitra')}
              />
              TBRA AND HITRA
            </td>
            <td>
              <input
                type="checkbox"
                name="fittings"
                style={{ marginRight: '25px' }}
                {...register('fittings')}
              />
              FITTINGS
            </td>
            <td>
              <input
                type="checkbox"
                name="maintenanceTypes"
                style={{ marginRight: '25px' }}
                {...register('maintenanceTypes')}
              />
              TYPES OF MAINTENANCE
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="smp"
                style={{ marginRight: '25px' }}
                {...register('smp')}
              />
              SMP
            </td>
            <td>
              <input
                type="checkbox"
                name="workPermitSystem"
                style={{ marginRight: '25px' }}
                {...register('workPermitSystem')}
              />
              WORK PERMIT SYSTEM
            </td>
            <td>
              <input
                type="checkbox"
                name="pstFst"
                style={{ marginRight: '25px' }}
                {...register('pstFst')}
              />
              PST AND FST
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="fireGasSystem"
                style={{ marginRight: '25px' }}
                {...register('fireGasSystem')}
              />
              FIRE AND GAS SYSTEM
            </td>
            <td>
              <input
                type="checkbox"
                name="basicSafety"
                style={{ marginRight: '25px' }}
                {...register('basicSafety')}
              />
              BASIC SAFETY
            </td>
            <td>
              <input
                type="checkbox"
                name="msds"
                style={{ marginRight: '25px' }}
                {...register('msds')}
              />
              MSDS
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="fiveS"
                style={{ marginRight: '25px' }}
                {...register('fiveS')}
              />
              5S
            </td>
            <td>
              <input
                type="checkbox"
                name="codesStandards"
                style={{ marginRight: '25px' }}
                {...register('codesStandards')}
              />
              CODES AND STANDARDS
            </td>
            <td>
              <input
                type="checkbox"
                name="nearMissUnsafeCondition"
                style={{ marginRight: '25px' }}
                {...register('nearMissUnsafeCondition')}
              />
              NEAR MISS AND UNSAFE CONDITION
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="lprzt"
                style={{ marginRight: '25px' }}
                {...register('lprzt')}
              />
              LPRZT
            </td>
            <td>
              <input
                type="checkbox"
                name="nfpa"
                style={{ marginRight: '25px' }}
                {...register('nfpa')}
              />
              NFPA
            </td>
            <td>
              <input
                type="checkbox"
                name="lfi"
                style={{ marginRight: '25px' }}
                {...register('lfi')}
              />
              LFI
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="hartAndFFSystem"
                style={{ marginRight: '25px' }}
                {...register('hartAndFFSystem')}
              />
              HART AND FF SYSTEM
            </td>
            <td>
              <input
                type="checkbox"
                name="sisAndSilBasic"
                style={{ marginRight: '25px' }}
                {...register('sisAndSilBasic')}
              />
              SIS AND SIL BASIC
            </td>
            <td>
              <input
                type="checkbox"
                name="isoBasic"
                style={{ marginRight: '25px' }}
                {...register('isoBasic')}
              />
              ISO Basic
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="checkbox"
                name="emergencyResponse"
                style={{ marginRight: '25px' }}
                {...register('emergencyResponse')}
              />
              EMERGENCY RESPONSE
            </td>
            <td>
              <input
                type="checkbox"
                name="toolboxTalk"
                style={{ marginRight: '25px' }}
                {...register('toolboxTalk')}
              />
              ToolBox Talk
            </td>
            <td>
              <input
                type="checkbox"
                name="htm"
                style={{ marginRight: '25px' }}
                {...register('htm')}
              />
              HTM
            </td>
          </tr>
        </tbody>
      </table> }
            <table className='table custom-table table-responsive mt-5'>
              <tr>
                <th> PERFORMANCE EVALUATION:</th>
              </tr>
              <tr>
                <td scope="row">  <input type="checkbox" name="Outstanding" style={{ marginRight: '25px' }} checked={selectedUser.evaluation === "Outstanding"} />OUTSTANDING </td>
                <td scope="row">  <input type="checkbox" name="Good" style={{ marginRight: '25px' }} checked={selectedUser.evaluation === "Good"} />GOOD</td>
                <td scope="row">  <input type="checkbox" name="Below" style={{ marginRight: '25px' }} checked={selectedUser.evaluation === "Below"} />NOT COMPITENT</td>
              </tr>
              <tr>
                <td scope="row">  <input type="checkbox" name="Excellent" style={{ marginRight: '25px' }} checked={selectedUser.evaluation === "Excellent"} />EXCELLENT </td>
                <td scope="row">  <input type="checkbox" name="Average" style={{ marginRight: '25px' }} checked={selectedUser.evaluation === "Average"} />AVERAGE</td>
                <td></td>
              </tr>
            </table>

            <table className='table custom-table table-responsive text-center mt-5' style={{ border: "2px black solid", }}>
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th>REMARKS</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    KNOWLEDGE IN ASSESMENT MENTIONED
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    CANDIDATE CAN WORK INDIVIDUALLY AND IMPROVEMENT IN THEORATICAL KNOWLEDGE IS
                    REUIRED
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    CANDIDATE CAN WORK IN GROUP AS HE LACKS BOTH THEORATICAL AND PRACTICAL KNOWLEDGE
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    CANDIDATE NOT FIT FOR WORK
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <table>
              <tr>
                <th colSpan={1}>CANDIDATE<br></br>
                  SPECIALIZED IN:</th>
                <td></td></tr>
            </table>
          </div>
        </div> : <></>}
      </div>

    </>


  );
};

export default AdminApp;
