import React from 'react';
import './App.css'; 
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Tss from "./pages/tss";
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
      <h1>CU SUITS</h1>

      <Router>
        <Navbar />
        <Routes>
          <Route path="/Constant" element={<Constant />} />
          <Route path="/TSS" element={<Tss />} />
          <Route path="/Rover" element={<Rover />} />
          <Route path="/Rocks" element={<Rocks />} />
          <Route path="/Nav" element={<Nav />} />
          <Route path="/Ingress" element={<Ingress />} />
          <Route path="/Focus" element={<Focus />} />
          <Route path="/Equipment" element={<Equipment />} />
          <Route path="/Egress" element={<Egress />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

