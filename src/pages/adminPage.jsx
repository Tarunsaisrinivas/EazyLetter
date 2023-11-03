import React, { useContext } from 'react'
import { UserContext } from '../App'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const AdminPage = () => {
  const data=useContext(UserContext);
  const navigate = useNavigate()
  console.log(data.admin)
  const handleLogout = async (e) => {
    e.preventDefault();
    await axios.get('http://localhost:3000/logout')
    .then(res => navigate(0))
    .catch(err => console.log(err))
    } 
  
  return (
    <div>
    <div>Hello Sir {data.firstname}</div>
    <form onSubmit={handleLogout} method='POST'>
      <button type="submit">Log Out </button></form>
    </div>
  )
}

export default AdminPage