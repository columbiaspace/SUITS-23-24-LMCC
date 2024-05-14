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
import Constant from './pages/constant/constant2';
import { GlobalProvider } from './components/GlobalContext'; // Ensure this is the correct path to your GlobalContext

function App() {
  return (
    <GlobalProvider> {/* Wrap everything inside GlobalProvider to ensure context is available everywhere */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Setup />} />
          <Route path="/SUITS-23-24-LMCC" element={<Setup />} />
          <Route path="/constant" element={<Constant />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/egress" element={<Egress />} />
          <Route path="/nav" element={<Nav />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/rocks" element={<Rocks />} />
          <Route path="/rover" element={<Rover />} />
          <Route path="/ingress" element={<Ingress />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
