import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button'
import { useUserAuth } from '../context/UserAuthContext';
import '../App.css'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { logIn, googleSignIn } = useUserAuth();
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
        await logIn(email, password);
        navigate("/home");
      } catch (err) {
        setError(err.message);
      }
    };
  
    const handleGoogleSignIn = async (e) => {
      e.preventDefault();
      try {
        await googleSignIn();
        navigate("/home");
      } catch (error) {
        console.log(error.message);
      }
    };

    return (
        <>
            <div className='login position-absolute top-50 start-50 translate-middle'>
                <div className="form_container">
                    <div className="logo_container">
                        <img src={process.env.PUBLIC_URL + '/login-icon.png'} alt="" width={90} height={80}/>
                    </div>
                    <div className="title_container">
                        <p className="title">Login to your Account</p>
                        <span className="subtitle">
                            Get started with our app, just create an account and enjoy the experience.
                        </span>
                    </div>
                    {/* ---- error message ----- */}
                        {error && <div class="alert alert-danger py-2 " role="alert">
                            {`${error}`}
                        </div>}
                        <form className='form' onSubmit={handleSubmit}>
                            <div className="input_container">
                                <label className="input_label" htmlFor="email_field">
                                    Email
                                </label>
                                <input
                                    placeholder="name@mail.com"
                                    title="Input title"
                                    name="input-name"
                                    type="email"
                                    className="input_field"
                                    id="email_field"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="input_container">
                                <label className="input_label" htmlFor="password_field">
                                    Password
                                </label>
                                <input
                                    placeholder="Password"
                                    title="Input title"
                                    name="input-name"
                                    type="password"
                                    className="input_field"
                                    id="password_field"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button title="Sign In" type="Submit" className="sign-in_btn">
                                <span>Sign In</span>
                            </button>

                            <div className="separator">
                                <hr className="line" />
                                <span>Or</span>
                                <hr className="line" />
                            </div>
                            <GoogleButton  className='' type='dark' onClick={handleGoogleSignIn}/>
                            {/* <button title="Sign In" type="submit" className="sign-in_ggl">
                                <span>Sign In with Google</span>
                            </button> */}
                            {/* <button title="Sign In" type="submit" className="sign-in_apl">
                                <span>Sign In with Apple</span>
                            </button> */}
                            <div>For New Account&nbsp;<Link to="/signup" className='text-decoration-none text-danger fw-bold'>Register Now !</Link></div>
                            <p className="note">Terms of use &amp; Conditions</p>
                        </form>
                </div>
            </div>
        </>
    )
}

export default Login
