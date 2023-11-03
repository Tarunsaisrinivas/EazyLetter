import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import AdminPage from './pages/adminPage';
import '../src/pages/scss/Spinner.scss';
import MyNavbar from './pages/Navbar';
import StudentPage from './pages/StudentPage';
import LetterGenerator from './pages/LetterGenerator';
import AdminSignUp from './pages/AdminSignUp';



export const UserContext = createContext();

function App() {

  const [isLoading, setIsLoading] = useState(true); 

  axios.defaults.withCredentials = true;

  const [data, setData] = useState([

  ]);
  

  useEffect(() => {
    axios.get('http://localhost:3000/')
    .then(response => {
            setData(response.data);
            //console.log("Data:",response.data)
          })
      .catch((error) => {
        console.error('Error fetching data:', error);})
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <UserContext.Provider value={data}>
      <Router>
        <MyNavbar setData={setData}/>
        <div className="App">
          {isLoading ? ( 
            <div >Loading..</div>
          ) : (
            <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path='/LetterGenerator' element={data.isadmin || data.isadmin===undefined? <Navigate to='/' /> : <LetterGenerator />} />
            <Route path="/"  
            element={data?.isadmin === undefined ? (<Home />) : (data?.isadmin ? (data.admin ===undefined ?(<AdminPage />): (<AdminSignUp />)  ) : (<StudentPage />))}
            />
            </Routes>
          )}
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

