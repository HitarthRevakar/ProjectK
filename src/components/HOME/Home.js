import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { firestore } from "../../firebase";
import '.././HOME/home.css';

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    idnumber: "",
    nation:"",
    dob:"",
    email: "",
    mobile: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const form2 = async (e) => {
    e.preventDefault();

 try {
      const response = await firestore.collection('FormData').add(formData);
      window.alert(" Thank You! Best of Luck", response.id);
      setFormData({
        fullname: "",
        idnumber: "",
        nation:"",
        dob:"",
        email: "",
        mobile: "",
        state: "",
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
            <span className='fs-5'>Welcome,&nbsp;<span className='text-success fw-bold text-decoration-underline'>{user && user.email}</span></span> 
            <span><button className="btn btn-outline-danger px-3 rounded-0" onClick={handleLogout}>
            <i class="bi bi-box-arrow-in-left "></i>&nbsp;Log Out
        </button></span>
          </div>
          <div className='text-center'>
          <img src={process.env.PUBLIC_URL + '/TCIPL.jpg'} className='img-fluid'  alt="Logo" />
          </div>
        <div className='my-2'>
            {/* <div class="container ">
              <form class="row g-3 my-5" onSubmit={form2} >
                <div class="col-md-6">
                  <h4>Candidate Information</h4>
                  <table class="table">
                    <tr>
                      <td><label for="exampleInputName1" class="form-label">Candidate Name:</label></td>
                      <td><input type="text" name='fullname' value={formData.fullname} onChange={(e) => { handleChange(e) }} class="form-control" placeholder="Full Name" id="exampleInputName1" required/></td>
                    </tr>
                    <tr>
                      <td><label for="exampleInputId1" class="form-label">ID Number</label></td>
                      <td><input type="number" name='idnumber' value={formData.idnumber} onChange={(e) => { handleChange(e) }} class="form-control" id="exampleInputId1" required/></td>
                    </tr>
                    <tr>
                      <td><label for="exampleInputNation1" class="form-label">Nationality</label></td>
                      <td><input type="text" name='nation'  value={formData.nation} onChange={(e) => { handleChange(e) }} class="form-control" placeholder="Your Country Name" id="exampleInputNation1" /></td>
                    </tr>
                    <tr>
                      <td><label for="exampleInputDob1" class="form-label">Date Of Birth</label></td>
                      <td><input type="date" name='dob'  value={formData.dob} onChange={(e) => { handleChange(e) }} class="form-control" id="exampleInputDob1" /></td>
                    </tr>
                  </table>
                </div>
                <div class="col-md-6">
                  <h4>Contact Information</h4>
                  <table class="table">
                    <tr>
                      <td><label for="exampleInputEmail1" class="form-label">Email Address</label></td>
                      <td><input type="email" name='email' value={formData.email} onChange={(e) => { handleChange(e) }} class="form-control" placeholder="eg. name@mail.com" id="exampleInputEmail1" aria-describedby="emailHelp" /></td>
                    </tr>
                    <tr>
                      <td><label for="exampleInputMobile1" class="form-label">Contact No.</label></td>
                      <td><input type="text" name='mobile'  value={formData.mobile} onChange={(e) => { handleChange(e) }} class="form-control" placeholder="Your Mobile Number" id="exampleInputMobile1" /></td>
                    </tr>
                    <tr>
                      <td><label for="exampleInputState1" class="form-label">State</label></td>
                      <td><input type="text" name='state' value={formData.state} onChange={(e) => { handleChange(e) }} class="form-control" id="exampleInputState1" /></td>
                    </tr>
                  </table>
                </div>
                <div class="col-12 float-end">
                  <button class="btn btn-outline-dark rounded-0" type="submit">Submit</button>
                </div>
              </form>
            </div> */}
            <div class="container my-5">
<form>
<div class="table-responsive">
    <table class="table table-striped table-responsive">
        <tr>
            <td class="section-header" colspan="4">PERSONAL DETAILS:</td>
        </tr>
        <tr>
            <td rowspan="1">CANDIDATE NAME:</td>
            <td rowspan="1" className='align-items-center'>
                <input class="form-control" name="candidate_name" type="text" value="" />
                <br />
                <br />
                <img alt="Preview" id="preview" src="#" style={{maxWidth: "100px", maxHeight: "100px", display: "none"}} />
            </td>
            <td colSpan={1}>UPLOAD PASSPORT SIZE PHOTO:</td>
            <td colSpan={1}><input accept="image/*" class="form-control" name="user_photo" onchange="previewImage(this);" type="file" /></td>
        </tr>
        <tr className=''>
            <td>I.D NUMBER (GOVT APPROVED):</td>
            <td><input class="form-control" name="id_number" type="text" value="" /></td>
            <td>CONTACT NO: </td><td><input class="form-control" name="contact" type="text" value="" /></td>
        </tr>
        <tr>
        <td>EMAIL ID:</td><td><input class="form-control" name="email" type="email" value="" /></td>
            <td>NATIONALITY:</td><td><input class="form-control" name="nationality" type="text" value="" /></td>
        </tr>
        <tr>
        <td>STATE: </td><td><input class="form-control" name="state" type="text" value="" /></td>
            <td>MARITAL STATUS:</td>
            <td>
                <select class="form-select dropdown-toggle" name="marital_status">
                <option value="">Select an option</option>

                    <option value="single">Single</option>
                    <option value="married">Married</option>
                </select>
            </td>
        </tr>
        <tr>
            
            <td>DATE OF BIRTH:</td><td><input class="form-control" name="dob" type="date" value="" /></td>
        </tr>
    </table>
</div>

<table class="table table-bordered">
    <thead>
      <tr>
        <th colspan="5">LANGUAGES KNOWN:</th>
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
        <td><input class="form-check-input" type="checkbox" name="english_read" /></td>
        <td><input class="form-check-input" type="checkbox" name="hindi_read" /></td>
        <td><input class="form-check-input" type="checkbox" name="gujarati_read" /></td>
        <td><input class="form-check-input" type="checkbox" name="others_read" /></td>
      </tr>
      <tr>
        <td>WRITE</td>
        <td><input class="form-check-input" type="checkbox" name="english_write" /></td>
        <td><input class="form-check-input" type="checkbox" name="hindi_write" /></td>
        <td><input class="form-check-input" type="checkbox" name="gujarati_write" /></td>
        <td><input class="form-check-input" type="checkbox" name="others_write" /></td>
      </tr>
      <tr>
        <td>SPEAK</td>
        <td>
          <select class="form-select" name="english_speak">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </td>
        <td>
          <select class="form-select" name="hindi_speak">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </td>
        <td>
          <select class="form-select" name="gujarati_speak">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </td>
        <td>
          <select class="form-select" name="others_speak">
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
        <td class="sub-header">ACADEMIC:<input class="form-control" name="candidate_name" type="text" value="" /></td>
    </tr>
    <tr>
        <td>OTHERS:<input class="form-control" name="candidate_name" type="text" value="" /></td>
    </tr>
</table>

<table class="editable-table">
    <colgroup width="116"></colgroup>
    <colgroup width="150"></colgroup>
    <colgroup width="133"></colgroup>
    <tr>
        <td class="section-header" colspan="3">EXPERIENCE DETAILS:</td>
    </tr>
    <tr>
        <td>TOTAL YEARS OF EXPERIENCE:</td>
        <td colspan="2"><input class="form-control" name="candidate_name" type="text" value="" /></td>
    </tr>
    
    <table class="GeneratedTable">
        <thead>
            <tr rowspan="">
                <th>NAME OF THE COMPANY</th>
                <th>DESIGNATION</th>
                <th>FROM</th>
                <th>TILL</th>
            </tr>
        </thead>
        <tbody>

<tr>
    <td><input class="form-control" name="company_name_1" type="text" /></td>
    <td><input class="form-control" name="designation_1" type="text" /></td>
    <td>
        <center><input class="form-control" name="from_date_1" type="date" /></center>
    </td>
    <td>
        <center><input class="form-control" name="till_date_1" type="date" /></center>
    </td>
</tr>

<tr>
    <td><input class="form-control" name="company_name_2" type="text" /></td>
    <td><input class="form-control" name="designation_2" type="text" /></td>
    <td>
        <center><input class="form-control" name="from_date_2" type="date" /></center>
    </td>
    <td>
        <center><input class="form-control" name="till_date_2" type="date" /></center>
    </td>
</tr>

<tr>
    <td><input class="form-control" name="company_name_3" type="text" /></td>
    <td><input class="form-control" name="designation_3" type="text" /></td>
    <td>
        <center><input class="form-control" name="from_date_3" type="date" /></center>
    </td>
    <td>
        <center><input class="form-control" name="till_date_3" type="date" /></center>
    </td>
</tr>

<tr>
    <td><input class="form-control" name="company_name_4" type="text" /></td>
    <td><input class="form-control" name="designation_4" type="text" /></td>
    <td>
        <center><input class="form-control" name="from_date_4" type="date" /></center>
    </td>
    <td>
        <center><input class="form-control" name="till_date_4" type="date" /></center>
    </td>
</tr>

<tr>
    <td><input class="form-control" name="company_name_5" type="text" /></td>
    <td><input class="form-control" name="designation_5" type="text" /></td>
    <td>
        <center><input class="form-control" name="from_date_5" type="date" /></center>
    </td>
    <td>
        <center><input class="form-control" name="till_date_5" type="date" /></center>
    </td>
</tr>

<tr>
    <td><input class="form-control" name="company_name_6" type="text" /></td>
    <td><input class="form-control" name="designation_6" type="text" /></td>
    <td>
        <center><input class="form-control" name="from_date_6" type="date" /></center>
    </td>
    <td>
        <center><input class="form-control" name="till_date_6" type="date" /></center>
    </td>
</tr>
<tr>
    <td>FOR OFFICE USE: </td>
    <td>CANDIDATE VERIFIED AND SCREENED BY: </td>
</tr>
</tbody>
</table>
</table>
<button class="btn btn-outline-primary rounded-0" type="submit">Submit Form</button>
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


