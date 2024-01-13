import React, { useState } from 'react'

const ScrollLetters = ({data}) => {
   const [selected,setSelected] = useState(false);
   const handleClick = (index)=>{
    setSelected(index);
   }
  let LetterDetails=data["LetterDetails"];
  
  return (
    <div className='ScrollLetters'>
   <ul>
  {LetterDetails.map((item, index) => (
    <li key={index} className={`list-item ${selected === index ?'selected':''}`} onClick={() => handleClick(index)}><span>{item.userdetails.studentId} </span>
    <span>{item.userdetails.department}</span>
    <span>[ {item.details.reason} ]</span>
    <p className="time">10:10 AM</p>
    <span className='color'></span>
    </li>
        ))}
</ul>
    </div>
  )
}

export default ScrollLetters