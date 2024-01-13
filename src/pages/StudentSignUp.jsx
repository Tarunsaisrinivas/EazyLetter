import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faLock ,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const StudentSignUp = ({fun}) => {
  const hiddenRef = useRef(null);

  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [formData, setFormData] = useState({
    firstname:'',
    lastname:'',
    password:'',
    cpassword:'',
    email:'',
    studentId:'',
    department:'',
    contact:'',
    year:''
  });
  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  }

  const handleSignUpClick = () => {
    hiddenRef.current.click();
  };
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
    const response = await axios.post('http://localhost:3000/studentregister', formData);
    console.log(response.data.message);
    setErr(null);
    setMsg(response.data.message);
    window.location.href = "/";
    } catch (error) {
      console.error('Error:', error.response.data.error);
      setErr(error.response.data.error);
    setMsg(null);
    }
  };

  const handleClick = () => {
    fun();
  };

  return (
    <div className="signform-container">
    <div className="signup">
      <h2 className="title">Student Sign Up</h2>
      <form action="#" className="student-sign-up-form" onSubmit={handleSignup}>
        <div className="row">
        <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input type="text" placeholder="First Name" name='firstname'
        onChange={handleChange} />
          </div>
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input type="text" placeholder="Last Name" name='lastname'
        onChange={handleChange} />
          </div>
        </div>
        <div className='row'>
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faEnvelope} />
            <input type="email" placeholder="Email" name='email'
            onChange={handleChange} />
          </div>
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input type="tel" maxLength="10 " pattern="[0-9]{10}" placeholder="Contact Number" name='contact' onChange={handleChange}/>
          </div>
          
        </div>
  
        <div className="row">

          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <select type="text" placeholder="Department" name='department' onChange={handleChange}>
                 <option value="" >Department</option>
                <option value="CSE">CSE</option>
                <option value="AIML">AIML</option>
              </select>
          </div>
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <select type="text" placeholder="Year Of Study" name='year' onChange={handleChange}>
                 <option value="" >Year Of Study</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
          </div>
        </div>
        <div className='row'>
        <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input type="text" placeholder="Student ID" name='studentId'
            onChange={handleChange}/>
          </div>
        </div>
        <div className='row'>
        <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faLock} />
            <input type="password" placeholder="Password" name='password'
        onChange={handleChange} />
          </div>
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faLock} />
            <input type="password" placeholder="Confirm Password" name='cpassword'
        onChange={handleChange} />
          </div>
        </div>
        <button type="submit" ref={hiddenRef}  hidden/>
        </form>
        <button  className="btn" value="Sign Up" onClick={handleSignUpClick}>Sign Up</button>
        {err && <p style={{color:'red'}}>{err}</p>}
        {msg && <p style={{color:'green'}}>{msg}</p>}
        <p>Already Have An Account? <a onClick={handleClick}>Sign In.</a></p>
    </div>
  </div>
  
  )
}

export default StudentSignUp