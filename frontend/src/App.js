import React from 'react';
import {Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';
import User from './pages/User';
import List from './pages/List';
import Usuario from './pages/Usuario';
//import User from '../../backend/models/UserModel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form/>}/>
        <Route path='/user' element={<User/>}/>
        <Route path='/listforms' element={<List/>}/>
        <Route path='/usuario' element={<Usuario/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
