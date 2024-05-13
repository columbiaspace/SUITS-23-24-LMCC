import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Setup from "./pages/focus/setup";
import Rover from "./pages/focus/rover";
import Rocks from "./pages/focus/rocks";
import Nav from "./pages/focus/nav";
import Ingress from "./pages/focus/ingress";
import Equipment from "./pages/focus/equipment";
import Egress from "./pages/focus/egress";
import Constant from './pages/constant/constant';
import { GlobalProvider } from './components/GlobalContext'; // Import the provider

function App() {
  return (
    <GlobalProvider> {/* Wrap the routes within the GlobalProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Setup />} />
          <Route path="/Constant" element={<Constant />} />
          <Route path="/Setup" element={<Setup />} />
          <Route path="/Egress" element={<Egress />} />
          <Route path="/Nav" element={<Nav />} />
          <Route path="/Equipment" element={<Equipment />} />
          <Route path="/Rocks" element={<Rocks />} />
          <Route path="/Rover" element={<Rover />} />
          <Route path="/Ingress" element={<Ingress />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
