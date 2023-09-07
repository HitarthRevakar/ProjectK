import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './home.css'
function Home() {
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
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };



  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
  };
  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="table-responsive">
          <table className="table table-striped table-responsive">
            <tbody>
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
                    {...register('candidate_name', { required: true })}
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
                    {...register('user_photo', { required: true })}
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
                    {...register('id_number', { required: true })}
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
                    {...register('contact', { required: true })}
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
                    {...register('email', { required: true })}
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
                    {...register('nationality', { required: true })}
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
                    {...register('state', { required: true })}
                    className={`form-control ${
                      errors.state ? 'error-input' : ''
                    }`}
                  />
                </td>
                <td>MARITAL STATUS:</td>
                <td>
                  <select
                    name="marital_status"
                    {...register('marital_status', { required: true })}
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
                    {...register('dob', { required: true })}
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
                  {...register('language', { required: true })}
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

                  {...register('language', { required: true })}
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
                  {...register('language', { required: true })}
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
                  {...register('language', { required: true })}
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
                  {...register('academic_qualification', { required: true })}
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
                  {...register('total_experience', { required: true })}
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
        <button type="submit" className="btn btn-outline-primary rounded-0">
          Submit Form
        </button>
      </form>
    </div>

  );
}

export default Home;
