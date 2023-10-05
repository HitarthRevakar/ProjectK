import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore, storage } from "../../../firebase";
import "../EditForm/EditForm.css";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { async } from "q";
import firebase from 'firebase/compat/app';
import { Hourglass } from 'react-loader-spinner'
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BsDownload } from "react-icons/bs";
import questionsSet1 from '../../QuestionPaper/Electrical.json'
import questionsSet3 from '../../QuestionPaper/Safety.json'

import questionsSet2 from '../../QuestionPaper/Instrumentation.json';
// import { saveAs } from 'file-saver'; // For downloading files
// import { pdf } from '@react-pdf/renderer'; // For PDF generation
// import XLSX from 'xlsx'; // For Excel generation
const EditForm = () => {
  const { id } = useParams();
  const [result, setResult] = useState();
  const [percentage, setPercentage] = useState();
  const [evaluation, setEvaluation] = useState("")
  const [fileUrls, setFileUrls] = useState({});
  const [loading, setLoading] = useState(false)
  const [Competency, setCOMPETENCY] = useState("")

  /*
  90+
Excellent		76-89
Good		60-75
Average		50-59
Below		0-49 */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState({});
  // let imageRef = useRef();



  useEffect(() => {
    let userId = id;
    const resultRef = firestore.collection('candidate-info')
    async function fetchResult() {
      const snapshot = await resultRef.get();
      const formsData = snapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data(), // Data inside the document
      }));
      const result1 = formsData.find(user => user.id == id)

      debugger
      // Set the forms state with the fetched data
      setResult(result1);


     

      if(result1.compentencyAssessment){
        let compentencyAssessment = JSON.parse(result1.compentencyAssessment)
      for (const key in compentencyAssessment) {
        if (Object.hasOwnProperty.call(compentencyAssessment, key)) {
          const value = compentencyAssessment[key];
          setValue(key, value);
        }
      }
      }
      
      for (const key in result1) {
        if (Object.hasOwnProperty.call(result1, key)) {
          const value = result1[key];
          setValue(key, value);
        }
      }
      // setValue(result)
      
    }
    fetchResult();

  }, [])

  // useEffect(()=>{
  //   if(result){

  //     
  //   }
  // },[result])

  useEffect(() => {
    // Use a useEffect hook to fetch the candidate's data for editing
    const fetchCandidateData = async () => {
      try {
        // Reference the "candidate-info" collection in Firestore
        const candidateRef = firestore.collection("candidate-info").doc(id);

        // Fetch the candidate's data
        const doc = await candidateRef.get();

        // Check if the candidate exists
        if (doc.exists) {
          console.log(doc.data());

          ;
          // Set the formData state with the fetched data
          setFormData({
            id: doc.id
            , ...doc.data()
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching candidate data: ", error);
      }
    };

    fetchCandidateData(); // Call the fetchCandidateData function when the component mounts
  }, [id]);

  // Function to handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

  };
  let navigate = useNavigate()

  const onSubmit = async (data) => {
   
    const date = new Date(); // Your date object
    const timestamp = firebase.firestore.Timestamp.fromDate(date);

    setLoading(true)
    ;
    // Update Firestore
    data.userId = id;
    const querySnapshot = await firestore
      .collection('candidate-marks')
      .where('userId', '==', id)
      .get();
    let percentage = (data.total / 100) * 100;
    data.percentage = percentage;

    const storageRef = firebase.storage().ref();

    // Example: Upload written_photo
    let files = {}
    if (data.written_photo[0]) {
      const writtenPhotoRef = storageRef.child(`written_photos/${data.written_photo[0].name}`);
      await writtenPhotoRef.put(data.written_photo[0]);
      const writtenPhotoUrl = await writtenPhotoRef.getDownloadURL();

      files.written_photo = writtenPhotoUrl;
      
    }
    if (data.oral_video[0]) {
      const oral_videoref = storageRef.child(`oral_video/${data.oral_video[0].name}`);
      await oral_videoref.put(data.oral_video[0]);
      const oral_videorefUrl = await oral_videoref.getDownloadURL();
      files.oral_video = oral_videorefUrl;

    }
    if (data.practical_photo[0]) {
      const practical_photoref = storageRef.child(`practical_photos/${data.practical_photo[0].name}`);
      await practical_photoref.put(data.practical_photo[0]);
      const practical_photoUrl = await practical_photoref.getDownloadURL();
      files.practical_photo = practical_photoUrl;

    }

    // Repeat this process for other file inputs (e.g., oral_video, practical_photo)

    // Now, you have the download URLs for all uploaded files
    // Add the data along with file URLs to Firestore
    if (querySnapshot.empty) {
      data.evaluatedDate = timestamp
      data.lastEvaluatedDate = timestamp
      const firestore = firebase.firestore();
      try {
        
        delete data.written_photo;
        delete data.oral_video;
        delete data.practical_photo
        await firestore.collection('candidate-marks').add({
          ...data,
          ...files,


          // Add other file URLs here
        }).then(async (docRef) => {
          let compentencyAssessment = ""
          if(result?.discipline == "Electrical"){
               compentencyAssessment = JSON.stringify({
            pmOfLtMotors: data.pmOfLtMotors,
            pmOfSwitchGear: data.pmOfSwitchGear,
            pmOfPP: data.pmOfPP,
            pmOfHtMotors: data.pmOfHtMotors,
            cmOfSwitchGear: data.cmOfSwitchGear,
            pmOfLdb: data.pmOfLdb,
            cmOfLtMotors: data.cmOfLtMotors,
            pmOfPowerTransformer: data.pmOfPowerTransformer,
            meggering: data.meggering,
            cmOfHtMotors: data.cmOfHtMotors,
            cmOfPowerTransformer: data.cmOfPowerTransformer,
            basicSafety: data.basicSafety,
            pmOfEarthPit: data.pmOfEarthPit,
            glandingAndTermination: data.glandingAndTermination,
            tbraAndHitra: data.tbraAndHitra,
            cableLaying: data.cableLaying,
            emergencyResponse: data.emergencyResponse,
            toolBoxTalk: data.toolBoxTalk,
            rolesAndResponsibilities: data.rolesAndResponsibilities,
            lprzt: data.lprzt,
            workPermitSystem: data.workPermitSystem})
          } else {
            compentencyAssessment = JSON.stringify({
              temperatureMeasurement: data.temperatureMeasurement,
              pressureMeasurement: data.pressureMeasurement,
              levelMeasurement: data.levelMeasurement,
              flowMeasurement: data.flowMeasurement,
              vibrationMeasurement: data.vibrationMeasurement,
              controlValve: data.controlValve,
              onOffValve: data.onOffValve,
              switches: data.switches,
              openCloseLoopInterlock: data.openCloseLoopInterlock,
              tciCsiInstruments: data.tciCsiInstruments,
              pid: data.pid,
              termination: data.termination,
              dcs: data.dcs,
              plc: data.plc,
              esd: data.esd,
              mcms: data.mcms,
              irpMarshallingControlCabiner: data.irpMarshallingControlCabiner,
              weighingSystem: data.weighingSystem,
              ppes: data.ppes,
              analyser: data.analyser,
              instrumentationCables: data.instrumentationCables,
              atexCertification: data.atexCertification,
              dataSheet: data.dataSheet,
              cableScheduleJbSchedule: data.cableScheduleJbSchedule,
              dryLoopWetLoopCheck: data.dryLoopWetLoopCheck,
              llf: data.llf,
              earthingGrounding: data.earthingGrounding,
              tbraHitra: data.tbraHitra,
              fittings: data.fittings,
              maintenanceTypes: data.maintenanceTypes,
              smp: data.smp,
              workPermitSystem: data.workPermitSystem,
              pstFst: data.pstFst,
              fireGasSystem: data.fireGasSystem,
              basicSafety: data.basicSafetyEmergencyResponse,
              msds: data.lfi,
              fiveS: data.fiveS,
              codesStandards: data.codesStandards,
              nearMissUnsafeCondition: data.nearMissUnsafeCondition,
              lprzt: data.lprzt,
              hartAndFFSystem: data.hartAndFFSystem,
              sisAndSilBasic: data.sisAndSilBasic,
              isoBasic: data.isoBasic,
              emergencyResponse: data.emergencyResponse,
              toolboxTalk: data.toolboxTalk,
              htm: data.htm,
            });
            
          }
        
          toast.success('Data added Successfully!');
          console.log('Document written with ID: ', docRef.id);
          const querySnapshot = firestore
            .collection('candidate-info').doc(id)
          // let formData1 = formData;
          // formData1.marksId = docRef.id
          debugger
          const newData = {
            marksId: docRef.id,
            evaluation,
            evaluatedDate: timestamp,
            lastEvaluatedDate: timestamp,
            writtenMarks: data.written,
            oralMarks: data.oral,
            practicalMarks: data.practical,
            behaviourMarks: data.behaviour,
            totalMarks: data.total,
            compentencyAssessment,
           ...files
          };
          debugger
          querySnapshot
            .update(newData)
            .then(() => {
              setTimeout(() => {
                navigate('/admin')
              }, 2000);
              console.log('Document successfully updated!');
            })
            .catch((error) => {
              console.error('Error updating document: ', error);
            });
        });
        setLoading(false)
        
        console.log('Data added to Firestore successfully');
      } catch (error) {
        console.error('Error adding data to Firestore', error);
      }
    }

    ;

    // Check if a document with the same user ID exists

    if (!querySnapshot.empty) {
      data.lastEvaluatedDate = timestamp
      
      // If a document exists, update it
      const docRef = querySnapshot.docs[0];
      // Assuming there's only one matching document
      delete data.written_photo;
      delete data.oral_video;
      delete data.practical_photo

      await docRef.ref.update({ ...data, ...files, });
      let compentencyAssessment
      const querySnapshot1 = firestore
        .collection('candidate-info').doc(id);
        if(result?.discipline == "Electrical"){
          compentencyAssessment = JSON.stringify({
       pmOfLtMotors: data.pmOfLtMotors,
       pmOfSwitchGear: data.pmOfSwitchGear,
       pmOfPP: data.pmOfPP,
       pmOfHtMotors: data.pmOfHtMotors,
       cmOfSwitchGear: data.cmOfSwitchGear,
       pmOfLdb: data.pmOfLdb,
       cmOfLtMotors: data.cmOfLtMotors,
       pmOfPowerTransformer: data.pmOfPowerTransformer,
       meggering: data.meggering,
       cmOfHtMotors: data.cmOfHtMotors,
       cmOfPowerTransformer: data.cmOfPowerTransformer,
       basicSafety: data.basicSafety,
       pmOfEarthPit: data.pmOfEarthPit,
       glandingAndTermination: data.glandingAndTermination,
       tbraAndHitra: data.tbraAndHitra,
       cableLaying: data.cableLaying,
       emergencyResponse: data.emergencyResponse,
       toolBoxTalk: data.toolBoxTalk,
       rolesAndResponsibilities: data.rolesAndResponsibilities,
       lprzt: data.lprzt,
       workPermitSystem: data.workPermitSystem})
     } else {
      debugger
       compentencyAssessment = JSON.stringify({
         temperatureMeasurement: data.temperatureMeasurement,
         pressureMeasurement: data.pressureMeasurement,
         levelMeasurement: data.levelMeasurement,
         flowMeasurement: data.flowMeasurement,
         vibrationMeasurement: data.vibrationMeasurement,
         controlValve: data.controlValve,
         onOffValve: data.onOffValve,
         switches: data.switches,
         openCloseLoopInterlock: data.openCloseLoopInterlock,
         tciCsiInstruments: data.tciCsiInstruments,
         pid: data.pid,
         termination: data.termination,
         dcs: data.dcs,
         plc: data.plc,
         esd: data.esd,
         mcms: data.mcms,
         irpMarshallingControlCabiner: data.irpMarshallingControlCabiner,
         weighingSystem: data.weighingSystem,
         ppes: data.ppes,
         analyser: data.analyser,
         instrumentationCables: data.instrumentationCables,
         atexCertification: data.atexCertification,
         dataSheet: data.dataSheet,
         cableScheduleJbSchedule: data.cableScheduleJbSchedule,
         dryLoopWetLoopCheck: data.dryLoopWetLoopCheck,
         llf: data.llf,
         earthingGrounding: data.earthingGrounding,
         tbraHitra: data.tbraHitra,
         fittings: data.fittings,
         maintenanceTypes: data.maintenanceTypes,
         smp: data.smp,
         workPermitSystem: data.workPermitSystem,
         pstFst: data.pstFst,
         fireGasSystem: data.fireGasSystem,
         basicSafety: data.basicSafetyEmergencyResponse,
         msds: data.lfi,
         fiveS: data.fiveS,
         codesStandards: data.codesStandards,
         nearMissUnsafeCondition: data.nearMissUnsafeCondition,
         lprzt: data.lprzt,
         hartAndFFSystem: data.hartAndFFSystem,
         sisAndSilBasic: data.sisAndSilBasic,
         isoBasic: data.isoBasic,
         emergencyResponse: data.emergencyResponse,
         toolboxTalk: data.toolboxTalk,
         htm: data.htm,
       });
       
     }
   
      // let formData1 = formData;
      // formData1.marksId = docRef.id
      const newData = {
        // Define the fields and new values you want to update
        // For example:
        marksId: docRef.id,
        evaluation,
        lastEvaluatedDate: timestamp,
        writtenMarks: data.written,
        oralMarks: data.oral,
        practicalMarks: data.practical,
        behaviourMarks: data.behaviour,
        totalMarks: data.total,
        writtenMarks: data.written,
        oralMarks: data.oral,
        compentencyAssessment,
        practicalMarks: data.practical,
        behaviourMarks: data.behaviour,
        totalMarks: data.total,
        written_photo: result.written_photo,
        oral_video: result.oral_video,
        practical_photo: result.practical_photo
        // Add more fields as needed
      };
      querySnapshot1
        .update(newData)
        .then(() => {
          setTimeout(() => {
            navigate('/admin');
          }, 2000);
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
        });

      
      toast.success('Data updated Successfully!');
      
      setTimeout(() => {
        navigate('/admin')
      }, 2000);
      setLoading(false)
      console.log('Document updated with ID: ', docRef.id);

    } else {
      // If no document exists, add a new one
      console.log('Document: ', data);

      firestore
        .collection('candidate-marks')
        .add(data)
        .then(async (docRef) => {
          // 
          // const docRef1 = querySnapshot.docs[0]; 
          // 
          // await docRef1.ref.update(formData1);
          // 
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    }
  };

  useEffect(() => {
    setValue('written', result?.writtenMarks);
    setValue('oral', result?.oralMarks);
    setValue('practical', result?.practicalMarks);
    setValue('total', result?.totalMarks);
    setValue('behaviour', result?.behaviourMarks);
    

    if (result?.totalMarks) {

      if (result.totalMarks >= 90) {
        setEvaluation("Outstanding")
      } else if (result.totalMarks < 90 && result.totalMarks >= 76) {
        setEvaluation("Excellent")
      } else if (result.totalMarks < 76 && result.totalMarks >= 60) {
        setEvaluation("Good")
      } else if (result.totalMarks < 60 && result.totalMarks >= 50) {
        setEvaluation("Average")
      } else if (result.totalMarks < 50) {
        setEvaluation("Below")
      }
    }

  }, [result]);
  // Function to handle form submission (update candidate data)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Reference the "candidate-info" collection in Firestore
  //     const candidateRef = firestore.collection('candidate-info').doc(id);

  //     // Update the candidate's data with the new formData
  //     await candidateRef.update(formData);

  //     // Redirect to the admin page or another page after successful update
  //     // You can use React Router's history or a Link component for navigation
  //     // Example: history.push('/admin');
  //   } catch (error) {
  //     console.error('Error updating candidate data: ', error);
  //   }
  // };

  function calculateTotal() {
    
    // Define your fields by their 'name' attributes
    let written1 =
      parseFloat(document.querySelector("input[name='written']").value) || 0;

    let oral1 =
      parseFloat(document.querySelector("input[name='oral']").value) || 0;

    let practical1 =
      parseFloat(document.querySelector("input[name='practical']").value) ||
      0;

    let behaviour1 =
      parseFloat(document.querySelector("input[name='behaviour']").value) ||
      0;
    // Calculate the totals
    let total1 = written1 + oral1 + practical1 + behaviour1;
    let percentage = (total1 / 100) * 100;
    // setPercentage(percentage1.toFixed(2));
    if (percentage >= 90) {
      setEvaluation("Outstanding")
    } else if (percentage < 90 && percentage >= 76) {
      setEvaluation("Excellent")
    } else if (percentage < 76 && percentage >= 60) {
      setEvaluation("Good")
    } else if (percentage < 60 && percentage >= 50) {
      setEvaluation("Average")
    } else if (percentage < 50) {
      setEvaluation("Below")
    }
    
    setValue('total', total1)
    // Update the total fields
    document.querySelector("input[name='total']").value = total1;
  }


  document.querySelectorAll(".marks").forEach(function (input) {
    input.addEventListener("input", calculateTotal);
  });

  // const generatePDF = async () => {
  //   // Create a PDF document using react-pdf
  //   const pdfDocument = (
  //     <YourPDFComponent data={/* Data to be included in the PDF */} />
  //   );

  //   // Generate the PDF blob
  //   const pdfBlob = await pdf(pdfDocument).toBlob();

  //   // Download the PDF file
  //   saveAs(pdfBlob, 'your-file-name.pdf');
  // };

  // // Function to generate an Excel file
  // const generateExcel = () => {
  //   // Prepare your data for Excel
  //   const excelData = [
  //     // ... Prepare your data as an array of arrays or objects
  //   ];

  //   // Create a new Excel Workbook
  //   const workbook = XLSX.utils.book_new();

  //   // Convert your data to an Excel sheet
  //   const worksheet = XLSX.utils.json_to_sheet(excelData);

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  //   // Generate a binary Excel file and save it
  //   const excelBinary = XLSX.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'blob',
  //   });

  //   // Download the Excel file
  //   saveAs(excelBinary, 'your-file-name.xlsx');
  // };

  return (
    <div className="my-4" id="editCandidate">
      <div><Toaster /></div>
      <div className="container">
        <div className="row">
          <form onSubmit={handleSubmit(onSubmit)} className="userDetail">
            <div className="my-3">
              <h1 className="text-center text-decoration-underline fw-bold border-2 border py-2">
                Assessment Report
              </h1>
            </div>

            <div className="d-md-flex border px-1">
              <div className="col-lg-9 col-md-7 col-sm-12 ">
                <div className="my-4 px-3">
                  <div className="mb-3">
                    <p>
                      Candidate Name:{" "}
                      <span className="fw-bold">{formData.candidate_name}</span>
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      ID No:{" "}
                      <span className="fw-bold">{formData.id_number}</span>
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      Jobber Name:{" "}
                      <span className="fw-b">{formData.contractor_name}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-5 col-sm-12 ">
                <div className="d-flex justify-content-center ">
                  <img
                    src={formData.user_photo}
                    alt="user-photo"
                    className="w-50 img-fluid img-thumbnail user-photo  my-3"
                  />
                </div>
              </div>
            </div>

            {/* --------  Marks Details ------ */}
            <div className="my-5" id="marksTable">
              <div class=" table-responsive-sm text-center">
                <table className="table custom-table table-responsive">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">
                        Desciptions
                      </th>
                      <th scope="col" className="text-center">
                        Marks Obtained
                      </th>
                      <th scope="col" className="text-center">
                        Upload Documents
                      </th>
                      <th scope="col" className="text-center">
                        Marks Allocate
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr class="">
                      <td scope="row" className="text-center">
                        Written
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <input
                            type="text"
                            name="written"
                            required
                            {...register("written", { required: true, max: 35 })}
                            className={`form-control text-center marks ${errors.written ? "error-input" : ""
                              }`}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="r1">
                          <td>
                            {result && result?.written_photo ? (
                              // Display the download URL if result.written_photo exists
                              <a href={result.written_photo} target="_blank" rel="noopener noreferrer">
                                Download Document
                              </a>
                            ) : (
                              // Display the upload input if result.written_photo doesn't exist
                              <input
                                type="file"
                                accept="*/*"
                                name="written_photo"
                                required
                                {...register('written_photo', { required: true })}
                              />
                            )}
                          </td>


                        </div>
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <p>35</p>
                        </div>
                      </td>
                    </tr>
                    <tr class="">
                      <td scope="row" className="text-center">
                        Oral
                      </td>
                      <td >
                        <div className="r1">
                          <input
                            type="text"
                            name="oral"
                            required
                            {...register("oral", { required: true, max: 20 })}
                            className={`form-control text-center marks ${errors.oral ? "error-input" : ""
                              }`}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="r1">
                          {result && result.oral_video ? (
                            // If result is defined and result.oral_video has a value, show a download link
                            <a href={result.oral_video} target="_blank" rel="noopener noreferrer">
                              Download Video
                            </a>
                          ) : (
                            // If result is undefined or result.oral_video is empty, show an upload input
                            <input
                              type="file"
                              accept="video/*"
                              name="oral_video"
                              required
                              {...register('oral_video', { required: true })}
                              style={{ marginLeft: "170px" }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <p>20</p>
                        </div>
                      </td>
                    </tr>
                    <tr class="">
                      <td scope="row" className="text-center">
                        Practical
                      </td>
                      <td >
                        <div className="r1">
                          <input
                            type="text"
                            name="practical"
                            required
                            {...register("practical", { required: true, max: 40 })}
                            className={`form-control text-center marks ${errors.practical ? "error-input" : ""
                              }`}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="r1">
                          {result && result.practical_photo ? (
                            <div>
                              <a href={result.practical_photo} target="_blank" rel="noopener noreferrer">
                                Download Video
                              </a>
                            </div>
                          ) : (
                            <div  >
                              {/* <p>Upload:</p> */}
                              <input
                                type="file"
                                accept="video/*"
                                name="practical_photo"
                                required
                                {...register('practical_photo', { required: true })}
                                style={{ marginLeft: "170px" }}
                              />
                            </div>
                          )}


                        </div>
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <p>40</p>
                        </div>
                      </td>
                    </tr>
                    <tr class="">
                      <td scope="row" className="text-center">
                        Behaviour
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <input
                            type="text"
                            name="behaviour"
                            required
                            {...register("behaviour", { required: true, max: 5 })}
                            className={`form-control text-center marks ${errors.behaviour ? "error-input" : ""
                              }`}
                          />
                        </div>
                      </td>
                      <td>

                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <p>5</p>
                        </div>
                      </td>
                    </tr>
                    <tr class="">
                      <td scope="row" className="text-center">
                        Total
                      </td>

                      <td className="text-center">
                        <div className="r1">
                          <input
                            type="text"
                            name="total"
                            {...register("total", { required: false })}
                            className={`form-control text-center marks ${errors.total ? "error-input" : ""
                              }`}
                          />
                        </div>
                      </td>
                      <td></td>
                      <td className="text-center">
                        <div className="r1">
                          <p>100</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              {result?.discipline == "Electrical" ?
              <table className="table custom-table table-responsive mt-5">
                <tr>
                  <th>COMPETENCY ASSESSMENT:</th>
                </tr>
                <tr colSpan="3">
                  <td colSpan="1" scope="col">
                    <input
                      type="checkbox"
                      name="pmOfLtMotors"
                      style={{ marginRight: '25px' }}
                      {...register('pmOfLtMotors')}

                    // checked={result && result.pmOfLtMotors === true}
                    // onChange={(e) => setResult({ ...result, pmOfLtMotors: e.target.checked })}
                    />
                    PM OF LT MOTORS
                  </td>
                  <td scope="col">
                    <input
                      type="checkbox"
                      name="pmOfSwitchGear"
                      style={{ marginRight: '25px' }}
                      {...register('pmOfSwitchGear')}

                    // checked={result && result.pmOfSwitchGear === true}
                    // onChange={(e) => setResult({ ...result, pmOfSwitchGear: e.target.checked })}

                    />
                    PM OF SWITCH GEAR
                  </td>
                  <td scope="col">
                    <input
                      type="checkbox"
                      name="pmOfPP"
                      style={{ marginRight: '25px' }}
                      {...register('pmOfPP')}

                    // checked={result && result.pmOfPP === true}
                    // onChange={(e) => setResult({ ...result, pmOfPP: e.target.checked })}

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
                      {...register('pmOfHtMotors')}

                    // checked={result && result.pmOfHtMotors === true}
                    // onChange={(e) => setResult({ ...result, pmOfHtMotors: e.target.checked })}
                    />
                    PM OF HT MOTORS
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="cmOfSwitchGear"
                      style={{ marginRight: '25px' }}
                      {...register('cmOfSwitchGear')}

                    // checked={result && result.cmOfSwitchGear === true}
                    // onChange={(e) => setResult({ ...result, cmOfSwitchGear: e.target.checked })}
                    />
                    CM OF SWITCH GEAR
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="pmOfLdb"
                      style={{ marginRight: '25px' }}
                      {...register('pmOfLdb')}

                    // checked={result && result.pmOfLdb === true}
                    // onChange={(e) => setResult({ ...result, pmOfLdb: e.target.checked })}
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
                      {...register('cmOfLtMotors')}

                    // checked={result && result.cmOfLtMotors === true}
                    // onChange={(e) => setResult({ ...result, cmOfLtMotors: e.target.checked })}
                    />
                    CM OF LT MOTORS
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="pmOfPowerTransformer"
                      style={{ marginRight: '25px' }}
                      {...register('pmOfPowerTransformer')}

                    // checked={result && result.pmOfPowerTransformer === true}
                    // onChange={(e) => setResult({ ...result, pmOfPowerTransformer: e.target.checked })}
                    />
                    PM OF POWER TRANSFORMER
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="meggering"
                      style={{ marginRight: '25px' }}
                      {...register('meggering')}

                    // checked={result && result.meggering === true}
                    // onChange={(e) => setResult({ ...result, meggering: e.target.checked })}
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
                      {...register('cmOfHtMotors')}

                    // checked={result && result.cmOfHtMotors === true}
                    // onChange={(e) => setResult({ ...result, cmOfHtMotors: e.target.checked })}
                    />
                    CM OF HT MOTORS
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="cmOfPowerTransformer"
                      style={{ marginRight: '25px' }}
                      {...register('cmOfPowerTransformer')}

                    // checked={result && result.cmOfPowerTransformer === true}
                    // onChange={(e) => setResult({ ...result, cmOfPowerTransformer: e.target.checked })}
                    />
                    CM OF POWER TRANSFORMER
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="basicSafety"
                      style={{ marginRight: '25px' }}
                      {...register('basicSafety')}

                    // checked={result && result.basicSafety === true}
                    // onChange={(e) => setResult({ ...result, basicSafety: e.target.checked })}
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
                      {...register('pmOfEarthPit')}

                    // checked={result && result.pmOfEarthPit === true}
                    // onChange={(e) => setResult({ ...result, pmOfEarthPit: e.target.checked })}
                    />
                    PM OF EARTH PIT
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="glandingAndTermination"
                      style={{ marginRight: '25px' }}
                      {...register('glandingAndTermination')}

                    // checked={result && result.glandingAndTermination === true}
                    // onChange={(e) => setResult({ ...result, glandingAndTermination: e.target.checked })}
                    />
                    GLANDING AND TERMINATION
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="tbraAndHitra"
                      style={{ marginRight: '25px' }}
                      {...register('tbraAndHitra')}

                    // checked={result && result.tbraAndHitra === true}
                    // onChange={(e) => setResult({ ...result, tbraAndHitra: e.target.checked })}
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
                      {...register('cableLaying')}

                    // checked={result && result.cableLaying === true}
                    // onChange={(e) => setResult({ ...result, cableLaying: e.target.checked })}
                    />
                    CABLE LAYING
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="emergencyResponse"
                      style={{ marginRight: '25px' }}
                      {...register('emergencyResponse')}

                    // checked={result && result.emergencyResponse === true}
                    // onChange={(e) => setResult({ ...result, emergencyResponse: e.target.checked })}
                    />
                    EMERGENCY RESPONSE
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="toolBoxTalk"
                      style={{ marginRight: '25px' }}
                      {...register('toolBoxTalk')}

                    // checked={result && result.toolBoxTalk === true}
                    // onChange={(e) => setResult({ ...result, toolBoxTalk: e.target.checked })}
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
                      {...register('rolesAndResponsibilities')}

                    // checked={result && result.rolesAndResponsibilities === true}
                    // onChange={(e) => setResult({ ...result, rolesAndResponsibilities: e.target.checked })}
                    />
                    ROLES AND RESPONSIBILITIES
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="lprzt"
                      style={{ marginRight: '25px' }}
                      {...register('lprzt')}

                    // checked={result && result.lprzt === true}
                    // onChange={(e) => setResult({ ...result, lprzt: e.target.checked })}
                    />
                    LPRZT
                  </td>
                  <td scope="row">
                    <input
                      type="checkbox"
                      name="workPermitSystem"
                      style={{ marginRight: '25px' }}
                      {...register('workPermitSystem')}

                    // checked={result && result.workPermitSystem === true}
                    // onChange={(e) => setResult({ ...result, workPermitSystem: e.target.checked })}
                    />
                    WORK PERMIT SYSTEM
                  </td>
                </tr>
              </table>
              : <table className="table custom-table table-responsive mt-5">
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
      </table>

}

            </div>
            <div>
              <div class="table-responsive">
                <table class="table ">
                  <thead>
                    <tr>
                      <th scope="col" colSpan={3}>
                        Official Use Only (Evaluate According to Marks)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr className="">
                      <td scope="row">Outstanding</td>
                      <td><input type="checkbox" name="Outstanding" checked={evaluation == "Outstanding"} /></td>

                    </tr>
                    <tr className="">
                      <td scope="row">Excellent</td>
                      <td><input type="checkbox" name="Excellent" checked={evaluation == "Excellent"} /></td>

                    </tr>
                    <tr className="">
                      <td scope="row">Good</td>
                      <td><input type="checkbox" name="Good" checked={evaluation == "Good"} /></td>

                    </tr>
                    <tr className="">
                      <td scope="row">Average</td>
                      <td><input type="checkbox" name="Average" checked={evaluation == "Average"} /></td>

                    </tr>
                    <tr className="">
                      <td scope="row">Below</td>
                      <td><input type="checkbox" name="Below" checked={evaluation == "Below"} /></td>

                    </tr>
                  </tbody>

                </table>
              </div>
            </div>
            <div className="d-flex row-xl-6 justify-content-between">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              {loading ? <Hourglass
                visible={true}
                height="40"
                width="40"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={['#306cce', '#72a1ed']}
              /> : <></>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
