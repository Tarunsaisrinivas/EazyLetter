import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faLock ,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AdminSignIn = () => {

  const hiddenRef = useRef(null);
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [err,setErr]=useState('');
  const [msg,setMsg]=useState('');

  axios.defaults.withCredentials = true;
  const handleSignInClick = () => {
    hiddenRef.current.click();
  };
  const handleLogin = async (e) => {
    e.preventDefault();
   
    try {
    const response = await axios.post('http://localhost:3000/adminlogin', { staffId, password });
    if(response.data === "Success") {
      window.location.href = "/"
    }
    setErr(false);
    setMsg(response.data);
    } catch (error) {
      console.error('Error:', error.response.data.error);
      setMsg(false);
      setErr(error.response.data.error);
    }
  };
  return (
    <div className="signform-container">
    <div className="signin">
          <form action="#" className="admin-sign-in-form" onSubmit={handleLogin}>
          <h2 className="title">Admin Sign In</h2>
            {err && <p style={{color:'red'}}>{err}</p>}
            {msg && <p style={{color:'green'}}>{msg}</p>
            }
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input type="text" placeholder="Staff ID" value={staffId}
            onChange={(e) => setStaffId(e.target.value)}/>
          </div>
          <div className="input-field">
          <FontAwesomeIcon className="icon" icon={faLock} />
            <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button type="submit" ref={hiddenRef}  hidden/>
        </form>
          <button  className="btn solid" value="Login" onClick={handleSignInClick}>Sign In</button>
      </div>
    </div>
  )
}

export default AdminSignIn