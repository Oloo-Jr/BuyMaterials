import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Login from './Screens/SignIn/SignIn';
import AddProduct from './Screens/AddProduct/AddProduct';
import Home from './Screens/HomePage/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
