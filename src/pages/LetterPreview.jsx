import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import Srkrlogo from '../img/srkrec.png'
import './scss/LetterPreview.scss'
import axios from 'axios';

const LetterPreview = ({details}) => {

  const userdetails=useContext(UserContext);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const staff=details.stafftype;
  let staffId;
  if(staff==='Hod'|| staff==='principal'){
    staffId=staff;
  }else{
    staffId=details.facultyid;
}
  const [adminInfo,setAdminInfo] =useState({
        firstname: '',
        lastname:'',
        department: '',
        contact: '',
        email: '',
        staffId:staffId
  });
  const [isLoading,setIsLoading] =useState(true);
  const department=userdetails.department;

  useEffect(() => {
    axios.post('http://localhost:3000/getadmininfo',{ staffId,department})
    .then(response => {
      setAdminInfo({
        ...adminInfo,
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        department: response.data.department,
        contact: response.data.contact,
        email: response.data.email,
      });
      
          })
      .catch((error) => {
        console.error('Error fetching data:', error);})
        .finally(() => setIsLoading(false));
  }, [staffId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
    const response = await axios.post('http://localhost:3000/submitletter', {details,userdetails,adminInfo});
    setErr(null);
        setMsg(response.data.message);
    } catch (error) {
      console.error('Error:', error.response.data.error);
      setErr(error.response.data.error);
    setMsg(null);
    }
  };

  const reasonDescriptions = {
    Vacation: `.Because I am going for a Vacation Trip.`,
    'Medical reasons': `.Because of health issues [ ${details.customReason}].`,
    Events:`.Because I have to participate in a ${details.events}. This event is of great importance to me personally, and it presents a valuable opportunity for my personal and academic growth.`,
    Other: `due to ${details.customReason}.`,
  };
  
  const reason = details.reason in reasonDescriptions ? details.reason : '';
  const description = reasonDescriptions[reason];

    let letterTemplate = `
     
    <page class="letter-container" size="A4">
 <div class="srkrlogo">
   <img src=${Srkrlogo} alt='srkrlogo' />
 </div>
 <!-- Sender's Information -->
 <div class="sender-info">
   <div class="sender">
     <h4>${userdetails.firstname} ${userdetails.lastname}</h4>
     <h4>${userdetails.year}/4 ${userdetails.department} </h4>
     <h4>SRKR Engineering College </h4>
     <h4>Bhimavaram </h4>
     <h4 class="date">${details.formattedDate}</h4>
   </div>
 </div>

 <!-- Recipient's Information -->
 <h4>To,</h4>
  <p>${adminInfo?.firstname} ${adminInfo?.lastname}</p>
  ${details.stafftype==='principal'?'The Principal':`<p>${details.stafftype==='Hod'?'HOD Of ':'Faculty Of '}${adminInfo?.department} Department</p>`}
  <p>${adminInfo?.email}</p>
  <p>+91 ${adminInfo?.contact}</p>
 <p>SRKR Engineering College </p>
 <p>Bhimavaram </p>

 <!-- Subject -->
 <div class="subject">
   <p><strong>Subject: Leave Application</strong></p>
 </div>

 <!-- Letter Content -->
 <div class="letter-content">
   <p class="greet">
     Dear Sir/Madam,
   </p>

   <p class="para1">
     &emsp;&emsp;&emsp;&emsp; &emsp;&emsp;
     I hope this letter finds you well. I am writing to formally request a leave of absence  

     ${
       details.duration === 'oneday' ? `on ${details.applydate}` : ` from ${details.applydate} to ${details.enddate}`
}  
    <b> ${description} </b>
   </p> 

   <p class="para1">

     I understand the importance of my academic responsibilities, and I assure you that my absence during this period will not disrupt my studies or the educational process. I am committed to staying on top of my coursework, completing any pending assignments, and communicating with my professors or instructors to ensure that I do not fall behind.
     
   </p>

   ${details.reason==='Medical reasons' ?`<p class="para1">
     Please find attached any required medical documents or additional information to support my leave application. I
     am committed to adhering to the company/university's policies and procedures regarding leaves and will ensure a
     smooth transition during my absence.
   </p>`:''}

   <p class="para1">
  
   I kindly request your approval for this leave application and would appreciate your prompt attention to this matter. If there are any specific procedures or requirements for requesting a leave of absence for students, please let me know, and I will ensure that all necessary steps are followed.
   </p>
   <p class="para1">
     Thank you for considering my request.
   </p>
 </div>
 <!-- Signature -->
 <div class="sender-info">
   <div class="sender">
   <h4>Sincerely,</h4>
   <p>${userdetails.firstname} ${userdetails.lastname}</p>
   <p>${userdetails.studentId} </p>
   <p>${userdetails.year}/4 ${userdetails.department} </p>
   <p>+91 ${userdetails.contact}</p>
   </div>
   </div>
 </div>
</page>
     `;


  return (
    <>
    { isLoading ? ( 
    <div >Loading..</div>
    ) : (
      <><div id="letterPreview"  
          dangerouslySetInnerHTML={{
            __html: letterTemplate,
          }}
        /> 
        <div className='submitbtn'> 
        <button
            onClick={handleSubmit}
            className="generate-btn"
          >Submit Letter</button>
          </div>
          {err && <p style={{color:'red'}}>{err}</p>}
          {msg && <p style={{color:'green'}}>{msg}</p>}
        </>)
  }</> )
}

export default LetterPreview