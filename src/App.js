import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Screens/SignIn/SignIn';
import AddProduct from './Screens/AddProduct/AddProduct';

import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/addproduct" element={<AddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
