import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faLock ,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const StudentSignIn = ({fun}) => {
  const hiddenRef = useRef(null);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  axios.defaults.withCredentials = true;

  const handleSignInClick = () => {
    hiddenRef.current.click();
  };

  const handleClick = () => {
    fun();
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
    const response = await axios.post('http://localhost:3000/studentlogin', { studentId, password });
    setMsg(response.data);
    if(response.data === "Success") {
      setErr(null);
      window.location.href = "/"
     }
    } catch (error) {
      console.error('Error:', error.response.data.error);
      setMsg(null);
      setErr(error.response.data.error)
    }
  };

  return (
    <div className="signform-container ">
    <div className="signin">
        <form action="#" className="student-sign-in-form" onSubmit={handleLogin}>
          <h2 className="title">Student Sign in</h2>
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input type="text" placeholder="Student Id" value={studentId}
            onChange={(e) => setStudentId(e.target.value)}/>
          </div>
          <div className="input-field">
          <FontAwesomeIcon className="icon" icon={faLock} />
            <input type="password" placeholder="Password"  value={password}
            onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button type="submit" ref={hiddenRef}  hidden/>
        </form>
          <button  className="btn solid" value="Login" onClick={handleSignInClick}>Sign In</button>
        <p>Don't Have An Account?<a onClick={handleClick}>Create New Account.</a></p>
        </div>
        </div>
  )
}

export default StudentSignIn