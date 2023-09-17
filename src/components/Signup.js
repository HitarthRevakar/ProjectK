import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import '../App.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [error, setError] = useState('');
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validate email and password here if needed
      if (!email || !password || !firstName || !lastName) {
        setError('Please fill in all fields.');
        return;
      }
      await signUp(email, password, firstName, lastName);
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
            <img src={process.env.PUBLIC_URL + '/signup-icon.png'} className='border-0' width={80} height={80} alt="icon" />
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
              <label className="input_label" htmlFor="user_field">
                First Name
              </label>
              <input
                placeholder="Ex. Smith "
                type="text"
                className="input_field"
                id="user_field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input_container">
              <label className="input_label" htmlFor="user_field">
                Last Name
              </label>
              <input
                placeholder="Ex.  Parkar"
                type="text"
                className="input_field"
                id="user_field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
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
            <Link to="/" className="text-decoration-none text-primary fw-bold">
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