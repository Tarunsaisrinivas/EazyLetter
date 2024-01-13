import React from 'react'
import { useNavigate } from 'react-router-dom';
import './scss/StudentPage.scss'

const StudentPage = () => {
  const navigate = useNavigate()

    const handleClick = async(e) =>
    {
      e.preventDefault();
      navigate('/LetterGenerator');
    }
  return (
    <div>
    <div className='StudentMain'>
    <div className='whole'>
      <div className='part'>
        <button onClick={handleClick} className='block'>Generate Letters</button>
        <button className='block'>Approved Letters</button>
      </div>
      <div className='part'>
        <button className='block'>Pending Letters</button>
        <button className='block'>Rejected Letters</button>
      </div>
    </div>
    </div>
    </div>
  )
}

export default StudentPage