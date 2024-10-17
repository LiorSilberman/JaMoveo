import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import Home from './components/home/Home';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/signup' Component={Signup} />
          <Route path='/login' Component={Login} />
          <Route path='/' Component={Home} />
        </Routes>
      </div>
    </Router>
  );
}

export default App