import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../../../firebase";
import "../EditForm/EditForm.css";
import { useForm } from "react-hook-form";
const EditForm = () => {
  const { id } = useParams();
  const [result, setResult] = useState();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState({
    candidate_name: "",
    email: "",
    contractor_name: "",
    // Add other form fields here and initialize them as needed
  });

  //   useEffect(()=>{
  // let userId = id;
  //       const resultRef = firestore.collection('candidate-marks')
  //     async  function fetchResult(){
  //       const docs = await resultRef.get();
  //       if (docs.data().length) {
  //         // Set  formData state with the fetched data
  //         setResult(docs.data());
  //       } else {
  //         console.log('No such document!');
  //       }
  //       }
  //       fetchResult();
  //   },[])

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
          debugger;
          // Set the formData state with the fetched data
          setFormData(doc.data());
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
  const onSubmit = (data) => {
    // Update Firestore
    data.userId = id;
    firestore
      .collection("candidate-marks").add(data)


      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
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

  document.addEventListener("DOMContentLoaded", function () {
    function calculateTotal() {
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

      // Update the total fields
      document.querySelector("input[name='total']").value = total1;
    }

    // Attach event listeners to each input field
    document.querySelectorAll(".marks").forEach(function (input) {
      input.addEventListener("input", calculateTotal);
    });
  });

  return (
    <div className="my-4" id="editCandidate">
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
                        Marks Allocate
                      </th>
                      <th scope="col" className="text-center">
                        QR Code
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
                            className={`form-control text-center marks ${
                              errors.written ? "error-input" : ""
                            }`}
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
                            className={`form-control text-center marks ${
                              errors.oral ? "error-input" : ""
                            }`}
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
                            className={`form-control text-center marks ${
                              errors.practical ? "error-input" : ""
                            }`}
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
                            className={`form-control text-center marks ${
                              errors.total ? "error-input" : ""
                            }`}
                          />
                        </div>
                      </td>
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
                    <tr class="">
                      <td scope="row">Outstanding</td>
                      <td></td>
                      <td>90+</td>
                    </tr>
                    <tr class="">
                      <td scope="row">Excellent</td>
                      <td>Item</td>
                      <td>76-89</td>
                    </tr>
                    <tr class="">
                      <td scope="row">Good</td>
                      <td>Item</td>
                      <td>60-75</td>
                    </tr>
                    <tr class="">
                      <td scope="row">Average</td>
                      <td>Item</td>
                      <td>50-59</td>
                    </tr>
                    <tr class="">
                      <td scope="row">Below</td>
                      <td>Item</td>
                      <td>0-49</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
