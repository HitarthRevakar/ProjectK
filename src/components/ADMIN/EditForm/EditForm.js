import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore ,storage } from "../../../firebase";
import "../EditForm/EditForm.css";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { async } from "q";
import firebase from 'firebase/compat/app';
import { Hourglass } from 'react-loader-spinner'

const EditForm = () => {
  const { id } = useParams();
  const [result, setResult] = useState();
  const [percentage, setPercentage] = useState();
  const [evaluation, setEvaluation] = useState("")
  const [fileUrls, setFileUrls] = useState({});
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    let userId = id;
    debugger
    const resultRef = firestore.collection('candidate-marks')
    async function fetchResult() {
      const snapshot = await resultRef.get();
      const formsData = snapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data(), // Data inside the document
      }));

      const result1 = formsData.find(user => user.userId == id)
debugger
      // Set the forms state with the fetched data
      setResult(result1);
      // setValue(result)
      debugger
    }
    fetchResult();
  }, [])

  // useEffect(()=>{
  //   if(result){

  //     debugger
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

          debugger;
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
    setLoading(true)
    debugger;
    // Update Firestore
    data.userId = id;
    const querySnapshot = await firestore
    .collection('candidate-marks')
    .where('userId', '==', id)
    .get();
    let percentage = (data.total / 300) * 100;
    data.percentage = percentage;

    const storageRef = firebase.storage().ref();

    // Example: Upload written_photo
    let files = {}
    if (data.written_photo[0]) {
      const writtenPhotoRef = storageRef.child(`written_photos/${data.written_photo[0].name}`);
      await writtenPhotoRef.put(data.written_photo[0]);
      const writtenPhotoUrl = await writtenPhotoRef.getDownloadURL();
      
      files.written_photo=writtenPhotoUrl;
      debugger
    }
    if (data.oral_video[0]) {
      const oral_videoref = storageRef.child(`oral_video/${data.oral_video[0].name}`);
      await oral_videoref.put(data.oral_video[0]);
      const oral_videorefUrl = await oral_videoref.getDownloadURL();
      
      files.oral_video=oral_videorefUrl;
      
    }
    if (data.practical_photo[0]) {
      const practical_photoref = storageRef.child(`practical_photos/${data.practical_photo[0].name}`);
      await practical_photoref.put(data.practical_photo[0]);
      const practical_photoUrl = await practical_photoref.getDownloadURL();
      
      files.practical_photo=practical_photoUrl;
      
    }
    
    // Repeat this process for other file inputs (e.g., oral_video, practical_photo)

    // Now, you have the download URLs for all uploaded files
    // Add the data along with file URLs to Firestore
    if(querySnapshot.empty){
        
      const firestore = firebase.firestore();
      try {
        debugger
        delete data.written_photo;
        delete data.oral_video;
        delete data.practical_photo
        await firestore.collection('candidate-marks').add({
          ...data,
          ...files
  
          // Add other file URLs here
        }).then(async (docRef)=>{
          toast.success('Data added Successfully!');
          console.log('Document written with ID: ', docRef.id);
          const querySnapshot = firestore
            .collection('candidate-info').doc(id)
          // let formData1 = formData;
          // formData1.marksId = docRef.id
          const newData = {
            // Define the fields and new values you want to update
            // For example:
            marksId:  docRef.id
            // Add more fields as needed
          };
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
        })
        setLoading(false)
        debugger
        console.log('Data added to Firestore successfully');
      } catch (error) {
        console.error('Error adding data to Firestore', error);
      }
    }
   
    debugger;

    // Check if a document with the same user ID exists
  
    if (!querySnapshot.empty) {
      // If a document exists, update it
      const docRef = querySnapshot.docs[0];
       // Assuming there's only one matching document
       delete data.written_photo;
       delete data.oral_video;
       delete data.practical_photo
      await docRef.ref.update({...data, ...files});
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
      
          // debugger
          // const docRef1 = querySnapshot.docs[0]; 
          // debugger
          // await docRef1.ref.update(formData1);
          // debugger

        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    }
  };

  useEffect(() => {
    setValue('written', result?.written);
    setValue('oral', result?.oral);
    setValue('practical', result?.practical);
    setValue('total', result?.total);
    
    if (result?.percentage) {

      if (result.percentage >= 90) {
        setEvaluation("Outstanding")
      } else if (result.percentage < 90 && result.percentage >= 76) {
        setEvaluation("Excellent")
      } else if (result.percentage < 76 && result.percentage >= 60) {
        setEvaluation("Good")
      } else if (result.percentage < 60 && result.percentage >= 50) {
        setEvaluation("Average")
      } else if (result.percentage < 50) {
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
    debugger
    // Define your fields by their 'name' attributes
    let written1 =
      parseFloat(document.querySelector("input[name='written']").value) || 0;

    let oral1 =
      parseFloat(document.querySelector("input[name='oral']").value) || 0;

    let practical1 =
      parseFloat(document.querySelector("input[name='practical']").value) ||
      0;

    // Calculate the totals
    let total1 = written1 + oral1 + practical1;
    let percentage = (total1 / 300) * 100;
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
    debugger
    setValue('total', total1)
    // Update the total fields
    document.querySelector("input[name='total']").value = total1;
  }


  document.querySelectorAll(".marks").forEach(function (input) {
    input.addEventListener("input", calculateTotal);
  });

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
                      ID Number:{" "}
                      <span className="fw-bold">{formData.id_number}</span>
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      Contractor Name:{" "}
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
              <div class=" table-responsive-sm">
                <table class="table ">
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
                            {...register("written", { required: true })}
                            className={`form-control text-center marks ${errors.written ? "error-input" : ""
                              }`}
                          />
                        </div>
                      </td>
                      <td style={{width:"fit-content"}}>
                      <div className="r1">
                     {/* {result?.written_photo ?  */}
                     <input  type="file" accept="image/*" 
                      name="written_photo"
                      {...register('written_photo', { required: true })}
                      />

                        </div>
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <p>100</p>
                        </div>
                      </td>
                    </tr>
                    <tr class="">
                      <td scope="row" className="text-center">
                        Oral
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <input
                            type="text"
                            name="oral"
                            {...register("oral", { required: true })}
                            className={`form-control text-center marks ${errors.oral ? "error-input" : ""
                              }`}
                          />
                        </div>
                      </td>
                      <td>
                      <div className="r1">
                      <input type="file" accept="video/*"  
                       name="oral_video"
                       {...register('oral_video', { required: true })}
                      />

                        </div>
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <p>100</p>
                        </div>
                      </td>
                    </tr>
                    <tr class="">
                      <td scope="row" className="text-center">
                        Practical
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <input
                            type="text"
                            name="practical"
                            {...register("practical", { required: true })}
                            className={`form-control text-center marks ${errors.practical ? "error-input" : ""
                              }`}
                          />
                        </div>
                      </td>
                      <td>
                      <div className="r1">
                      <input type="file" accept="image/*"  
                      name="practical_photo"
                      {...register('practical_photo', { required: true })}
                      />

                        </div>
                      </td>
                      <td className="text-center">
                        <div className="r1">
                          <p>100</p>
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
                          <p>300</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
/>:<></>}
</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
