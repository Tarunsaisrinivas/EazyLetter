import React, { useContext, useEffect, useState } from 'react'
import './scss/LetterGenerator.scss'
import LetterPreview from './LetterPreview';
import axios from 'axios';




const LetterGenerator = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [adminData, setAdminData] = useState([]);

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
  
    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  
    const [form,setForm]=useState({});

    const [details,setDetails]=useState({
      reason:'',
      customReason:null,
      events:'',
      formattedDate:formattedDate,
      duration:'oneday',
      applydate:'',
      enddate:'',
      stafftype:'Hod',
      facultyid:'',
      image:'',
      isApproved:false,
      isRejected:false,
      isPending:false
    })

    const clearImage = () => {
    details.image='';
    details.events='';
    details.customReason='';
    };
    
    const clear = () => {
      setDetails({
        ...details,
        image: '',
      });
    };

    const handleChange = (e) =>{
      if(e.target.name==="reason"){clearImage();}
      
      setDetails({
        ...details,
        [e.target.name] : e.target.value
      })
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
          
          setDetails({
            ...details,
            image: newDataUrl,
          });


        };
    
        img.src = reader.result; 
      };
    
      reader.readAsDataURL(e.target.files[0]);
    
      reader.onerror = (err) => {
        console.log("Error: ", err);
      };
    };


    const handleGenerateLetter = async(e) => {
      setForm(details);
      e.preventDefault(); 
      setShowPreview(true);
    };

    useEffect(() => {
      axios.post('http://localhost:3000/getadmin')
      .then(response => {
              setAdminData(response.data);
            })
        .catch((error) => {
          console.error('Error fetching data:', error);})

    }, []);

  return (
    <div className="container">
   <center>
     <h1>Letter Generator</h1>
   </center>
   <div className='LetterGenerator'>
     <form onSubmit={handleGenerateLetter}>
       <div className='row'>
         <div className='column'>
           <div className="input__group">
             <label htmlFor="reason">Reason For Leave:</label>
             <select className="select" id="reason" name='reason'value={details.reason} onChange={handleChange} required>
               <option value="" disabled> Select a reason </option>
               <option value="Family emergency">Family emergency</option>
               <option value="Medical reasons">Medical reasons</option>
               <option value="Vacation">Vacation</option>
               <option value="Events">Events</option>
               <option value="Other">Other</option>
             </select></div>
           <div className="input__group">
             <label htmlFor="duration">Duration Type:</label>
             <select className="select" id="duration" name='duration' value={details.duration} onChange={handleChange} required>
               <option value="oneday">One Day</option>
               <option value="multiday">Multiple Days</option>
             </select></div>
         </div>
         { (details.reason === 'Other' || details.reason ==='Medical reasons')&& <div className="input__group">
           <label htmlFor="customReason">Custom Reason:</label>
           <textarea id="customReason" width={500}  name='customReason' value={details.customReason || ''} onChange={handleChange} required />
           </div>}
           { details.reason === 'Events'&& <div className="input__group">
          <label htmlFor="Events">Event Name:</label>
          <textarea id="Events" width={500} name='events' value={details.events || ''} onChange={handleChange}
            required/>
          </div>}
          

           {details.reason === 'Medical reasons'&& <div className="input__group">
    <label htmlFor="medicalReasonFile">Attach Medical Document:(jpeg/jpg)</label>
    <input
      type="file"
      id="medicalReasonFile"
      accept=".jpg, .jpeg"
      onChange={(e) => convertToBase64AndCompress(e, 200)}
      onClick={clear}
      required/> 
  </div> }

  {(details.reason === 'Medical reasons' && details.image) &&  (
        <div className="compressed-image">
          <img src={details.image} alt="Compressed Image" height={150} width={150}/>
        </div>
      )}
        </div>
        <div className='row'>
            <div className="input__group">
          <label htmlFor="applyingDate">Applying Date:</label>
          <input
            type="date"
            id="applyingDate" 
            name='applydate' value={details.applydate} onChange={handleChange}   
            required/>
          </div>
         {details.duration =="multiday" &&<div className="input__group">
          <label htmlFor="enddate">End Date:</label>
          <input
            type="date"
            id="enddate"
            name='enddate' value={details.enddate} onChange={handleChange} 
            required/>
          </div>}
          </div>

          <div className='row'>
            <div className="input__group">
          <label htmlFor="stafftype">Staff Type:</label>
          <select className="select" id='stafftype' name='stafftype' value={details.stafftype} onChange={handleChange}  required>
               <option value="principal">Principal</option>
               <option value="faculty">Faculty</option>
               <option value="Hod">HOD</option>
             </select>
          </div>
         {details.stafftype =="faculty" &&<div className="input__group">
          <label htmlFor="facultyid">Select Faculty:</label>
          <select className="select" id='facultyid' name='facultyid' value={details.facultyid} onChange={handleChange}  required>
               <option value="" disabled>Select Faculty</option>
          {adminData.map(admin => (
            <option key={admin.staffid} value={admin.staffid}>
            {admin.fullname}
          </option>
               ))}
             </select>
          </div>}
          </div>
       <div className='btn'>
       <div className='input__group'>
          <button
            type='submit'
            className="generate-btn"
          >Generate Letter</button>
          </div>
          </div>
        </form>
        </div>
        {showPreview && (
        < >
        <center><h2 style={{color:"blue", margin:"20px 0" }}>Letter Preview</h2></center>
        {<LetterPreview details={form} />}
        </>
        )}
    </div> 
  )
}

export default LetterGenerator