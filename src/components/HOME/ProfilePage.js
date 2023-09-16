import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    gender: '',
    address: '',
    user_photo: '', // Add user_photo in the initial state
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can perform further actions with the form data here, like sending it to an API.
    console.log(formData);
  };

  return (
    <div className="container mt-5">
      <div className="text-start">
        <img
          src={formData.user_photo || 'https://placekitten.com/150/150'} // Replace with your image URL
          alt="Profile"
          className="rounded-circle"
          style={{ width: '150px', height: '150px' }}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="firstName">User Name:</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={formData.candidate_name}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            className="form-control"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <input
            type="text"
            className="form-control"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn btn-primary my-3">Submit</button>
      </form>
    </div>
  );
}

export default ProfilePage;
