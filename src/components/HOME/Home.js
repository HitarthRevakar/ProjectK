import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { firestore } from "../../firebase";
import '.././HOME/home.css';

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Data
    candidate_name:"",
    id_number:"",
    contact: "",
    email: "",
    nationality: "",
    candidate_state: "",
    marital_status:"",
    date_of_birth: "",
    trade_name:"",
    discipline:"",

    // Language Data of User
    // Reading Data
    english_read: "",
    hindi_read: "",
    gujarati_read:"",
    others_read: "",
    // Writing Data
    english_write: "",
    hindi_write: "",
    gujarati_write:"",
    others_write: "",
    // Speak Data
    english_speak: "",
    hindi_speak: "",
    gujarati_speak:"",
    others_speak: "",
    
    // Educational Data
    candidate_academic: "",
    candidate_others: "",

    // Experience Data
    candidate_experience:"",

    // candidate - Data - 1
    company_name_1: "",
    designation_1: "",
    from_date_1: "",
    till_date_1: "",

    // candidate - Data - 2
    company_name_2: "",
    designation_2: "",
    from_date_2: "",
    till_date_2: "",

    // candidate - Data - 3
    company_name_3: "",
    designation_3: "",
    from_date_3: "",
    till_date_3: "",

    // candidate - Data - 4
    company_name_4: "",
    designation_4: "",
    from_date_4: "",
    till_date_4: "",

    // candidate - Data - 5
    company_name_5: "",
    designation_5: "",
    from_date_5: "",
    till_date_5: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await firestore.collection('candidate-info').add(formData);
      window.alert(" Data Saved Successfully !", response.id);
      // navigate('/')
      setFormData({
    // Personal Data
    candidate_name:"",
    id_number:"",
    contact: "",
    email: "",
    nationality: "",
    candidate_state: "",
    marital_status:"",
    date_of_birth: "",
    trade_name:"",
    discipline:"",

    // Language Data of User
    // Reading Data
    english_read: "",
    hindi_read: "",
    gujarati_read:"",
    others_read: "",
    // Writing Data
    english_write: "",
    hindi_write: "",
    gujarati_write:"",
    others_write: "",
    // Speak Data
    english_speak: "",
    hindi_speak: "",
    gujarati_speak:"",
    others_speak: "",
    
    // Educational Data
    candidate_academic: "",
    candidate_others: "",

    // Experience Data
    candidate_experience:"",

    // candidate - Data - 1
    company_name_1: "",
    designation_1: "",
    from_date_1: "",
    till_date_1: "",

    // candidate - Data - 2
    company_name_2: "",
    designation_2: "",
    from_date_2: "",
    till_date_2: "",

    // candidate - Data - 3
    company_name_3: "",
    designation_3: "",
    from_date_3: "",
    till_date_3: "",

    // candidate - Data - 4
    company_name_4: "",
    designation_4: "",
    from_date_4: "",
    till_date_4: "",

    // candidate - Data - 5
    company_name_5: "",
    designation_5: "",
    from_date_5: "",
    till_date_5: "",
      });
    } catch (error) {
      console.error(error);
    }
  }


  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className='form2 ' id='form-2'>
       <div className='container-fluid'>
          <div className='navbar  d-flex justify-content-between  py-2 px-3 '>
            <span className='fs-5'>Welcome,&nbsp;<span className='text-success fw-bold text-decoration-underline'>{user && user.displayName}</span></span>
            <span><button className="btn btn-outline-danger px-3 rounded-0" onClick={handleLogout}>
            <i class="bi bi-box-arrow-in-left "></i>&nbsp;Log Out
        </button></span>
          </div>
          <div className='text-center'>
          <img src={process.env.PUBLIC_URL + '/TCIPL.jpg'} className='img-fluid'  alt="Logo" />
          </div>
        <div className='my-2'>
            <div class="container  my-5">
              <form onSubmit={handleSubmit}>
                <div class="table-responsive">
                  <table className="table">
                    <tr>
                      <td className="section-header" colspan="4">PERSONAL DETAILS:</td>
                    </tr>
                    <tr>
                      <td>CANDIDATE NAME:</td>
                      <td>
                        <span></span>
                        <input
                          type="text"
                          className="form-control"
                          name="candidate_name"
                          value={formData.candidate_name}
                          onChange={handleInputChange}
                          required
                        />
                        <br />
                        <img
                          alt="Preview"
                          id="preview"
                          src="#"
                          style={{ maxWidth: "100px", maxHeight: "100px", display: "none" }}
                        />
                      </td>
                      <td>UPLOAD PASSPORT SIZE PHOTO:</td>
                      <td>
                        <input
                          accept="image/*"
                          className="form-control"
                          name="user_photo"
                          onchange="previewImage(this);"
                          type="file"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>I.D NUMBER (GOVT APPROVED):</td>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          name="id_number"
                          value={formData.id_number}
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                      <td>CONTACT NO:</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>EMAIL ID:</td>
                      <td>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                      <td>NATIONALITY:</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>STATE:</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="candidate_state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>MARITAL STATUS:</td>
                      <td>
                        <select
                          className="form-select dropdown-toggle"
                          name="marital_status"
                          value={formData.marital_status}
                          onChange={handleInputChange}
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
                          className="form-control"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                      <td>TRADE NAME:</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="trade_name"
                          value={formData.trade_name}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>DISCIPLINE:</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="discipline"
                          value={formData.discipline}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </table>
                </div>

                <table>
                  <thead className=''>
                    <tr>
                      <th class="section-header" colspan="5">LANGUAGES KNOWN:</th>
                    </tr>
                    <tr className="text-center">
                      <th></th>
                      <th>ENGLISH</th>
                      <th>HINDI</th>
                      <th>GUJARATI</th>
                      <th>OTHERS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="text-center" >READ</td>
                      <td><input class="form-check-input" type="checkbox" name="english_read" value={formData.english_read} onChange={handleInputChange} /></td>
                      <td><input class="form-check-input" type="checkbox" name="hindi_read" value={formData.hindi_read} onChange={handleInputChange} /></td>
                      <td><input class="form-check-input" type="checkbox" name="gujarati_read" value={formData.gujarati_read} onChange={handleInputChange} /></td>
                      <td><input class="form-check-input" type="checkbox" name="others_read" value={formData.others_read} onChange={handleInputChange} /></td>
                    </tr>
                    <tr className="text-center">
                      <td className="text-center">WRITE</td>
                      <td><input class="form-check-input" type="checkbox" name="english_write" value={formData.english_write} onChange={handleInputChange} /></td>
                      <td><input class="form-check-input" type="checkbox" name="hindi_write" value={formData.hindi_write} onChange={handleInputChange} /></td>
                      <td><input class="form-check-input" type="checkbox" name="gujarati_write" value={formData.gujarati_write} onChange={handleInputChange}/></td>
                      <td><input class="form-check-input" type="checkbox" name="others_write" value={formData.others_write} onChange={handleInputChange} /></td>
                    </tr>
                    <tr>
                      <td className="text-center">SPEAK</td>
                      <td>
                        <select class="form-select " name="english_speak" value={formData.english_speak} onChange={handleInputChange}>
                          <option value="">Select Here</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </td>
                      <td>
                        <select class="form-select" name="hindi_speak" value={formData.hindi_speak} onChange={handleInputChange}>
                          <option value="">Select Here</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </td>
                      <td>
                        <select class="form-select" name="gujarati_speak" value={formData.gujarati_speak} onChange={handleInputChange}>
                          <option value="">Select Here</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </td>
                      <td>
                        <select class="form-select" name="others_speak" value={formData.others_speak} onChange={handleInputChange}>
                          <option value="">Select Here</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table class="editable-table" colspan="">
                  <tr>
                    <td class="section-header" colspan="2">EDUCATIONAL QUALIFICATION:</td>
                  </tr>
                  <tr>
                    <td class="sub-header">ACADEMIC:<input type="text" class="form-control" name="candidate_academic" value={formData.candidate_academic} onChange={handleInputChange}  /></td>
                  </tr>
                  <tr>
                    <td>OTHERS:<input ype="text" class="form-control" name="candidate_others" value={formData.candidate_others} onChange={handleInputChange} /></td>
                  </tr>
                </table>

                <table class="editable-table">
                  <thead>
                    <tr>
                      <th class="section-header" colspan="4">EXPERIENCE DETAILS:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="">TOTAL YEARS OF EXPERIENCE:&nbsp;<input type="text" class="form-control" name="candidate_experience" value={formData.candidate_experience} onChange={handleInputChange} />   </td>
                    </tr>
                  </tbody>
                </table>

                <table class="GeneratedTable">
                  <thead>
                    <tr>
                      <th>NAME OF THE COMPANY</th>
                      <th>DESIGNATION</th>
                      <th>FROM</th>
                      <th>TILL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><input class="form-control" name="company_name_1" type="text"  value={formData.company_name_1} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="designation_1" type="text" value={formData.designation_1} onChange={handleInputChange} /></td>
                      <td><input class="form-control" name="from_date_1" type="date" value={formData.from_date_1} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="till_date_1" type="date" value={formData.till_date_1} onChange={handleInputChange}/></td>
                    </tr>

                    <tr>
                      <td><input class="form-control" name="company_name_2" type="text" value={formData.company_name_2} onChange={handleInputChange} /></td>
                      <td><input class="form-control" name="designation_2" type="text" value={formData.designation_2} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="from_date_2" type="date" value={formData.from_date_2} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="till_date_2" type="date" value={formData.till_date_2} onChange={handleInputChange} /></td>
                    </tr>

                    <tr>
                      <td><input class="form-control" name="company_name_3" type="text" value={formData.company_name_3} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="designation_3" type="text" value={formData.designation_3} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="from_date_3" type="date" value={formData.from_date_3} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="till_date_3" type="date" value={formData.till_date_3} onChange={handleInputChange}/></td>
                    </tr>

                    <tr>
                      <td><input class="form-control" name="company_name_4" type="text" value={formData.company_name_4} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="designation_4" type="text" value={formData.designation_4} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="from_date_4" type="date" value={formData.from_date_4} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="till_date_4" type="date" value={formData.till_date_4} onChange={handleInputChange}/></td>
                    </tr>

                    <tr>
                      <td><input class="form-control" name="company_name_5" type="text" value={formData.company_name_5} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="designation_5" type="text" value={formData.designation_5} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="from_date_5" type="date" value={formData.from_date_5} onChange={handleInputChange}/></td>
                      <td><input class="form-control" name="till_date_5" type="date" value={formData.till_date_5} onChange={handleInputChange}/></td>
                    </tr>

                    <tr>
                      <td>FOR OFFICE USE:</td>
                      <td colspan="3">CANDIDATE VERIFIED AND SCREENED BY:</td>
                    </tr>
                  </tbody>
                </table>

              <div className='text-center my-5'>
                  <button type="button" class="btn btn-outline-primary rounded-0 px-5" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Final Submit
                  </button>

                  
                  <div class="modal fade rounded-0" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="staticBackdropLabel">Final Submit</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-start">
                        <h3>MCQ Examination Test</h3>
                        <p><span className='text-danger'>Please Select Your Examination Subject Carefully*</span></p>
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
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="submit" class="btn btn-success">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
                
              </form>
            </div>

<div class="container">
    <h4>NOTE:</h4>
    <ul>
        <li>CANDIDATE SHOULD REPORT WITH BASIC PPE'S</li>
        <li>ATTACH ALL RELEVANT EDUCATIONAL AND EXPERIENCE CERTIFICATES WITH THIS FORM</li>
        <li>CANDIDATE ARE REQUESTED TO STAY WITHIN THE SITE PREMISES FOR THE WHOLE DAY</li>
    </ul>
</div>
        </div>
       </div>
      </div>
    </>
  )
}

export default Home;


