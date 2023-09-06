// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import { useUserAuth } from '../context/UserAuthContext';
// import '../App.css'


// const Signup = () => {

// const [email, setEmail] = useState("");
// // const [name, setName] = useState("");
// const [password, setPassword] = useState("");
// const [error, setError] = useState("");
// const {signup}  = useUserAuth();
// const navigate = useNavigate();

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try{ 
//         await signup(email, password); 
//         navigate("/");
//     } catch (error) {
//         console.log(error.message);
//     }   
// };

// return (
//     <>
//       <div className='signup position-absolute top-50 start-50 translate-middle'>
//         <div className="form_container">
//           <div className="logo_container">
//             <img src={process.env.PUBLIC_URL + '/signup-icon.png'} width={80} height={80} />
//           </div>
//           <div className="title_container">
//             <p className="title">Register Your Account</p>
//             <span className="subtitle">
//               Get started with our app, just create an account and enjoy the experience.
//             </span>
//           </div>

//         {/* ----- error message -----*/}
//         {error && <div class="alert alert-danger py-2 " role="alert">
//          {error}
//         </div>}
//         <form className='form' onSubmit={handleSubmit}>
//             <div className="input_container">
//               <label className="input_label" htmlFor="email_field">
//                 Email
//               </label>
//               <input
//                 placeholder="name@mail.com"
//                 type="email"
//                 className="input_field"
//                 id="email_field"
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             {/* 
//             <div className="input_container">
//               <label className="input_label" htmlFor="name_field">
//                 Name
//               </label>
//               <input
//                 placeholder="Your Good Name"
//                 type="text"
//                 className="input_field"
//                 id="name_field"
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             */}
//             <div className="input_container">
//               <label className="input_label" htmlFor="password_field">
//                 Password
//               </label>
//               <input
//                 placeholder="Password"
//                 type="password"
//                 className="input_field"
//                 id="password_field"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <button type="submit" className="sign-in_btn">
//               <span>Sign Up</span>
//             </button>
//         </form>
  
//           <div className="separator">
//             <hr className="line" />
//             <span>Or</span>
//             <hr className="line" />
//           </div>
//           {/* <button title="Sign In" type="submit" className="sign-in_ggl">
//             <span>Sign In with Google</span>
//           </button> */}
//           {/* <button title="Sign In" type="submit" className="sign-in_apl">
//             <span>Sign In with Apple</span>
//           </button> */}
//           <div>Already have an Account?&nbsp;<Link to="/" className='text-decoration-none text-danger fw-bold'>Login !</Link></div>
//           <p className="note">Terms of use &amp; Conditions</p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Signup;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import '../App.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validate email and password here if needed
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      await signUp(email, password);
      window.alert('You are Successfully Registered !');
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="signup position-absolute top-50 start-50 translate-middle">
        <div className="form_container">
          <div className="logo_container">
            <img src={process.env.PUBLIC_URL + '/signup-icon.png'} width={80} height={80} alt="Logo" />
          </div>
          <div className="title_container">
            <p className="title">Register Your Account</p>
            <span className="subtitle">
              Get started with our app, just create an account and enjoy the experience.
            </span>
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}
          <form className="form" onSubmit={handleSubmit}>
            <div className="input_container">
              <label className="input_label" htmlFor="email_field">
                Email
              </label>
              <input
                placeholder="name@mail.com"
                type="email"
                className="input_field"
                id="email_field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input_container">
              <label className="input_label" htmlFor="password_field">
                Password
              </label>
              <input
                placeholder="Password"
                type="password"
                className="input_field"
                id="password_field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="sign-in_btn">
              <span>Sign Up</span>
            </button>
          </form>

          <div className="separator">
            <hr className="line" />
            <span>Or</span>
            <hr className="line" />
          </div>
          <div>
            Already have an Account?&nbsp;
            <Link to="/" className="text-decoration-none text-danger fw-bold">
              Login!
            </Link>
          </div>
          <p className="note">Terms of use &amp; Conditions</p>
        </div>
      </div>
    </>
  );
};

export default Signup;
