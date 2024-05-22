import React, { useState, useEffect } from "react";
import { NavLink as Link } from "react-router-dom";
import './navbar.css';

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await fetch('http://localhost:8000/warnings');
        const data = await response.json();
        const activeWarnings = Object.entries(data.error)
          .filter(([key, value]) => value)
          .map(([key]) => key);

        if (activeWarnings.length > 0) {
          setWarnings(activeWarnings);
          setShowModal(true);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error fetching warnings:', error);
      }
    };

    const interval = setInterval(fetchWarnings, 3000); // Fetch warnings every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowModal(false), 500); // Wait for the fade-out transition to complete
  };

  const getProcedure = (errorType) => {
    switch (errorType) {
      case 'fan_error':
        return (
          <>
            <p>Fan Error Detected!</p>
            <ol>
              <li>Swap FAN switch to secondary position</li>
              <li>Relay FAN position switch to LMCC</li>
              <li>Begin navigation back to airlock</li>
            </ol>
          </>
        );
      case 'oxy_error':
        return (
          <>
            <p>Oxygen Error Detected!</p>
            <ol>
              <li>Swap O2 switch to secondary position</li>
              <li>Relay O2 position switch to LMCC</li>
              <li>Begin navigation back to airlock</li>
            </ol>
          </>
        );
      case 'pump_error':
        return (
          <>
            <p>Abort Procedure Detected!</p>
            <ol>
              <li>Relay abort mission and return to airlock command to EVs</li>
            </ol>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="Navbar">
      <div className="NavMenu">
        <img className="img" src={require("./../assets/Images/logo.jpg")} alt="Logo"/>
        <h1 id="title">CUITS LMCC 2024</h1>
        <Link className="NavLink" to="/Constant" activeStyle={{ color: '#69b3e7' }}>
          Constant
        </Link>
        <Link className="NavLink" to="/Setup" activeStyle={{ color: '#69b3e7' }}>
          Setup
        </Link>
        <Link className="NavLink" to="/Egress" activeStyle={{ color: '#69b3e7' }}>
          Egress
        </Link>
        <Link className="NavLink" to="/Nav" activeStyle={{ color: '#69b3e7' }}>
          Nav
        </Link>
        <Link className="NavLink" to="/Equipment" activeStyle={{ color: '#69b3e7' }}>
          Equipment
        </Link>
        <Link className="NavLink" to="/Rocks" activeStyle={{ color: '#69b3e7' }}>
          Rocks
        </Link>
        <Link className="NavLink" to="/Rover" activeStyle={{ color: '#69b3e7' }}>
          Rover
        </Link>
        <Link className="NavLink" to="/Ingress" activeStyle={{ color: '#69b3e7' }}>
          Ingress
        </Link>
        {showModal && (
          <div className={`warning ${isVisible ? '' : 'hidden'}`}>
            <div className="warning-modal-content">
              {warnings.map((errorType) => (
                <div key={errorType}>
                  {getProcedure(errorType)}
                </div>
              ))}
              <button className="warning-acknowledge" onClick={closeModal}>
                I Acknowledge
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
