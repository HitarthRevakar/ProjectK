import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../../../firebase';
import '../EditForm/EditForm.css';
const EditForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    candidate_name: '',
    email: '',
    // Add other form fields here and initialize them as needed
  });

  useEffect(() => {
    // Use a useEffect hook to fetch the candidate's data for editing
    const fetchCandidateData = async () => {
      try {
        // Reference the "candidate-info" collection in Firestore
        const candidateRef = firestore.collection('candidate-info').doc(id);

        // Fetch the candidate's data
        const doc = await candidateRef.get();

        // Check if the candidate exists
        if (doc.exists) {
          // Set the formData state with the fetched data
          setFormData(doc.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching candidate data: ', error);
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

  // Function to handle form submission (update candidate data)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Reference the "candidate-info" collection in Firestore
      const candidateRef = firestore.collection('candidate-info').doc(id);

      // Update the candidate's data with the new formData
      await candidateRef.update(formData);

      // Redirect to the admin page or another page after successful update
      // You can use React Router's history or a Link component for navigation
      // Example: history.push('/admin');
    } catch (error) {
      console.error('Error updating candidate data: ', error);
    }
  };

  return (
    <div className='my-4' id='editCandidate'>
      <div className="container">
        <div className="row">
            
            <form onSubmit={handleSubmit} className='userDetail'>
              <div className='my-3'>
                <h1 className='text-center text-decoration-underline fw-bold border-2 border py-2'>Assessment Report</h1>
              </div>

              
              <div className='d-md-flex border px-1'>
                <div className='col-lg-9 col-md-7 col-sm-12 '>
                  <div className='my-4 px-3'>
                    <div className='mb-3'>
                      <p>Candidate Name: <span className='fw-bold'>{formData.candidate_name}</span></p>
                    </div>
                    <div className='mb-3'>
                      <p>ID Number: <span className='fw-bold'>{formData.id_number}</span></p>
                    </div>
                    <div className='mb-3'>
                      <p>Contractor Name: <span className='fw-b'>{formData.contractor_name}</span></p>
                    </div>
                  </div>
                </div>
                <div className='col-lg-3 col-md-5 col-sm-12 '>
                  <div className='d-flex justify-content-center '>
                    <img src={formData.user_photo} alt="user-photo" className='w-50 img-fluid img-thumbnail user-photo  my-3' />
                  </div>
                </div>

              </div>

            {/* <button type="submit" className="btn btn-primary">Save Changes</button> */}
            </form>
        </div>

        <div>
          <div class="table-responsive-sm">
            <table class="table table-primary">
              <thead>
                <tr>
                  <th scope="col">Desciptions</th>
                  <th scope="col">Marks Allocate</th>
                  <th scope="col">Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr class="">
                  <td scope="row">R1C1</td>
                  <td>R1C2</td>
                  <td>R1C3</td>
                </tr>
                <tr class="">
                  <td scope="row">Item</td>
                  <td>Item</td>
                  <td>Item</td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>



      </div>
    </div>
  );
};

export default EditForm;
