import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import './scss/Navbar.scss';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

function MyNavbar({setData}) {
  const hiddenRef = useRef(null);
  const user=useContext(UserContext);
  const navigate = useNavigate()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);


  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    const parentListItem = e.target.parentNode;
    const dropdown = parentListItem.querySelector('.navbar-dropdown');
    
    if (dropdown) {
      dropdown.classList.toggle('open');
      
      const otherDropdowns = document.querySelectorAll('.navbar-dropdown.open');
      otherDropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.remove('open');
        }
      });
    }
  };

  const handleOutsideClick = () => {
    const openDropdowns = document.querySelectorAll('.navbar-dropdown.open');
    openDropdowns.forEach((dropdown) => {
      dropdown.classList.remove('open');
    });
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);


  const handleClick = () => {
    hiddenRef.current.click();
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await axios.get('http://localhost:3000/logout')
    .then(res => navigate('/'))
    .then(() => {
      setData({}); // Reset user data on logout
    })
    .catch(err => console.log(err))
    }

  return (
    <section className="navigation">
      <div className="nav-container">
        <div className="brand">
          <a href="#!">Eazy Letter</a>
        </div>
        <nav> 
        <div className='Name'>Hello!! {user && user.firstname}</div>
          <div className="nav-mobile">
            <a id="navbar-toggle" href="#!" onClick={toggleMobileNav}>
              <span></span>
            </a>
          </div>
          <ul className={`nav-list ${isMobileNavOpen ? 'open' : ''}`}>
            <li>
              <a href="#!">Home</a>
            </li>
            <li>
              <a href="#!">About</a>
            </li>
            {/* <li>
              <a href="#!" onClick={handleDropdownClick}>
                Services
              </a>
              <ul className="navbar-dropdown">
                <li>
                  <a href="#!">Sass</a>
                </li>
                <li>
                  <a href="#!">Less</a>
                </li>
                <li> 
                  <a href="#!">Stylus</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#!">Portfolio</a>
            </li> */}
            <li>
              <a href="#!">Contact</a>
            </li>
            {  user?.staffId || user?.studentId?
            (<li>
              <a href="#!" onClick={handleDropdownClick}>
              <FontAwesomeIcon className="icon" icon={faUser} /> {user.firstname}
              </a>
              <ul className="navbar-dropdown">
                <li>
                  <a href="#!">Profile</a>
                </li>
                <li>
                  <a href="#!">Change Password</a>
                </li>
                <li>
                  <a href="#!" onClick={handleClick}>Log Out</a>
                </li>
              </ul>
            </li>):''}
          </ul>
          <form onSubmit={handleLogout} method='POST'>
          <button type="submit" ref={hiddenRef} hidden>Log Out </button></form>
        </nav>
      </div>
    </section>
  );
}

export default MyNavbar;
