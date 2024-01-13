import React, { useState } from 'react'
import './scss/Home.scss'
import log from '../img/log.svg'
import reg from '../img/register.svg'
import StudentSignIn from './StudentSignIn';
import StudentSignUp from './StudentSignUp';
import AdminSignIn from './AdminSignIn';
import AdminSignUp from './AdminSignUp';



const Home = () => {

const [isAdmin, setIsAdmin] = useState(false);
const [isToggle, setIsToggle] = useState(false);
const [isSignup, setIsSignup] = useState(false);


const toggleAdmin = () => {
  setIsSignup(false);
      setIsToggle(true);
      setIsAdmin(true);
    };

const toggleStudent = () => {
  setIsSignup(false);
    setIsToggle(true);
      setIsAdmin(false);
    };

const studentSign = () => {
      setIsSignup(prev => !prev);
      setIsAdmin(false);
  };


  return (
  <div className='Home'>
<div className={`container ${
  isToggle ? 
    (isSignup ? (isAdmin ? '' : 'student-signup') : (isAdmin ? 'admin-mode' : 'student-mode')) : ''
}`}>
    
    {isSignup ? (isAdmin ? <AdminSignUp/> : <StudentSignUp fun={studentSign}/>) : (isAdmin ? <AdminSignIn/> : <StudentSignIn fun={studentSign}/>)} 
    <div className="panels-container">
      <div className="panel left-panel">
        <div className="content">
          <h3>Are You An Admin?</h3>
          <div className='btn-container'>
          <button className="btn transparent" onClick={toggleAdmin} >
            Admin
          </button> 
          {/* <button className="btn transparent" onClick={studentSign} >
          {isSignup ? 'Sign In' : 'Sign Up'}
          </button> */}
          </div>
        </div>
        <img src={log} className="image" alt="" />
      </div>
       <div className="panel center-panel">
        <div className="content">
        <h3>Eazy Letter</h3>
        <p>Seamless Communication for Students and School Administrators</p>
        <div className='buttons'>
        <button className="btn transparent" onClick={toggleAdmin}>
             Admin
          </button>
          <button className="btn transparent" onClick={toggleStudent}>
            Student
          </button></div>
        </div> 
      </div>
      <div className="panel right-panel">
        <div className="content">
          <h3>Are You A Student?</h3>
          <div className='btn-container'>
          <button className="btn transparent" onClick={toggleStudent}>
            Student
          </button></div>
        </div>
        <img src={reg} className="image" alt="" />
      </div>
    </div>
  </div>
  </div>
  )
}


export default Home