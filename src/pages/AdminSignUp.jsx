import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faLock ,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './scss/Home.scss'

const AdminSignUp = () => {

  const hiddenRef = useRef(null);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState(
    {
      firstname:'',
      lastname:'',
      password:'',
      cpassword:'',
      email:'',
      contact:'',
      staffId:'',
      staff:'',
      department:'',
      image:image
    }
  );

const handleChange = (e) =>{
  setFormData({
    ...formData,
    [e.target.name] : e.target.value
  })
}

  const handleSignUpClick = () => {
    hiddenRef.current.click();
  };


  const clear=()=>{
    setImage(null);
  }

  const convertToBase64AndCompress = (e, maxSizeKB) => {
    const reader = new FileReader();
  
    reader.onload = () => {
      const img = new Image();
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        let quality = 1.0;
        let targetSizeKB = reader.result.length / 1024; 
        let newDataUrl;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          newDataUrl = canvas.toDataURL('image/jpeg', quality);
  
        while (targetSizeKB > maxSizeKB && quality > 0.1) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
  
          ctx.drawImage(img, 0, 0);
          newDataUrl = canvas.toDataURL('image/jpeg', quality);
  
          targetSizeKB = newDataUrl.length / 1024;
          quality -= 0.1;
        }
        
        setImage(newDataUrl);
      };
  
      img.src = reader.result; 
    };
  
    reader.readAsDataURL(e.target.files[0]);
  
    reader.onerror = (err) => {
      console.log("Error: ", err);
    };
  };

  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
     

      const response = await axios.post('http://localhost:3000/adminregister', formData);

      if (response.data && response.data.message) {
        setErr(null);
        setMsg(response.data.message);
      } else {
        console.error('Unexpected response:', response);
      }

  } catch (error) {
    console.error('Error:', error.response.data.error);
    setErr(error.response.data.error);
    setMsg(null);
  }
};

  



  return (
    <div className='admin-sign'>
    <div className="signform-container">
    <div className="signup">
    <h2 className="title">Admin Sign Up</h2>
    <form action="#" className="admin-sign-up-form" onSubmit={handleSubmit}>
    <div className="row">
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input
            type="text"
            placeholder="Firstname"
            name='firstname'
            onChange={handleChange}
           required/>
          </div>
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input
            type="text"
            placeholder="Lastname"
            name='lastname'
            onChange={handleChange}
           required/>
          </div>
          </div>
          <div className="row">
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faEnvelope} />
            <input 
            type="email" 
            placeholder="Email" 
            name='email'
            onChange={handleChange}
            required/>
          </div>

          <div className="input-field"  >
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input type="tel" maxLength="10" pattern="[0-9]{10}" placeholder="Contact Number"
             name='contact' onChange={handleChange} required/>
          </div>
          </div>

 
          <div className="row">
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <select type="text" placeholder="Staff Type"
             name='staff' value={formData.staff} onChange={handleChange} required>
                 <option value="" disabled>Staff Type</option>
                 <option value="principal">Principal</option>
                <option value="Hod">HOD</option>
                <option value="Faculty">Faculty</option>
              </select>
          </div>
          {(formData.staff === 'Hod'||formData.staff ==='Faculty')&&<div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <select type="text" placeholder="Department" 
            name='department' onChange={handleChange} value={formData.department} required >
                 <option value="" disabled>Department</option>
                <option value="CSE">CSE</option>
                <option value="AIML">AIML</option>
              </select>
          </div>}

          </div>

         <div className="row">
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <input type="text" placeholder="Staff ID" name='staffId' 
            onChange={handleChange}
             required/>
          </div>
          </div>

          <div className="row">
          <div className="input-field">
            <FontAwesomeIcon className="icon" icon={faLock} />
            <input
            type="password"
           placeholder="Password"
          name='password'
          onChange={handleChange}
      required/></div>

<div className="input-field">
            <FontAwesomeIcon className="icon" icon={faLock} />
            <input
            type="password"
           placeholder="Confirm Password"
          name='cpassword'
          onChange={handleChange}
      required/>
          
          </div>
          </div>

          <div className="row">   
          <div className="input-field" id='uploadsign'>
          <label>Upload Signature:</label>
    <input
      type="file"
      accept=".jpg, .jpeg, .png"
      onChange={(e) => convertToBase64AndCompress(e, 100)}
      onClick={clear}
      required
    />
          {image && (
        <div className="compressed-image">
          <img src={image} alt="Compressed Image" height={50} width={300}/>
        </div>
      )}
  </div>

          </div>
          <button type="submit" ref={hiddenRef}  hidden/>
        </form>
        <button  className="btn" value="Sign Up" onClick={handleSignUpClick}>Sign Up</button>
      </div>
      {err && <p style={{color:'red'}}>{err}</p>}
      {msg && <p style={{color:'green'}}>{msg}</p>}
    </div>
    </div>
  )
  }

export default AdminSignUp