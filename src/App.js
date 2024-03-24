import React from 'react';
import './App.css'; 
import Navbar from "./components/Navbar";
import BNavbar from "./components/BottomButtons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Setup from "./pages/setup";
import Rover from "./pages/rover";
import Rocks from "./pages/rocks";
import Nav from "./pages/nav";
import Ingress from "./pages/ingress";
import Focus from "./pages/focus";
import Equipment from "./pages/equipment";
import Egress from "./pages/egress";
import Constant from './pages/constant';


function App() {
  return (
    <div>
      <h1>CUITS 2024 LMCC</h1>

      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Constant />} />
          <Route path="/Constant" element={<Constant />} />
          <Route path="/Focus" element={<Focus />} />
          <Route path="/Setup" element={<Setup />} />
          <Route path="/Egress" element={<Egress />} />
          <Route path="/Nav" element={<Nav />} />
          <Route path="/Equipment" element={<Equipment />} />
          <Route path="/Rocks" element={<Rocks />} />
          <Route path="/Rover" element={<Rover />} />
          <Route path="/Ingress" element={<Ingress />} />
        </Routes>
        <BNavbar />
      </Router>
    </div>
  );
}

export default App;

