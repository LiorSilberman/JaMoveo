import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import Home from './components/mainPagePlayer/MainPagePlayer';
import AdminLogin from './components/adminLogin/AdminLogin';
import AdminPage from './components/adminPage/AdminPage';
import AdminResults from './components/adminResults/AdminResults';
import Live from './components/live/Live';
import Navbar from './components/navbar/Navbar';
import AdminSignup from './components/adminSignup/AdminSignup';



const App = () => {

  useEffect(() => {
    document.title = 'JaMoveo';
  }, []);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/signup' Component={Signup} />
          <Route path='/login' Component={Login} />
          <Route path='/admin/login' Component={AdminLogin} />
          <Route path='/admin/signup' Component={AdminSignup} />
          <Route path='/admin' Component={AdminPage} />
          <Route path='/results' Component={AdminResults} />
          <Route path='/' Component={Home} />
          <Route path='/live' Component={Live} />
        </Routes>
      </div>
    </Router>
  );
}

export default App