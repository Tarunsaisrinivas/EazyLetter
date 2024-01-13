import React, { useContext } from 'react'
import { UserContext } from '../App'
import Preview from './Preview';
import ScrollLetters from './ScrollLetters';
import './scss/AdminPage.scss'
const AdminPage = () => {
  const data=useContext(UserContext);

  return (
    <div className='AdminMain'>
    <ScrollLetters data={data}/>
    <Preview/>
    </div>
  )
}

export default AdminPage