import React, { useEffect, useState } from 'react'
import {firestore} from '../../firebase';
import '../ADMIN/Admin.css'

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
      } catch (error) {
        console.error('Error fetching forms: ', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);






  return (
    <div>
      
    </div>
  )
}

export default AdminApp
