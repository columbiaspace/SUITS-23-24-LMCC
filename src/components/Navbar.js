import React, { useState } from "react";
import { NavLink as Link } from "react-router-dom";
import './navbar.css';

// WarningModal Component
const WarningModal = ({ closeModal, isVisible }) => {
    return (
        <div className={`warning ${isVisible ? '' : 'hidden'}`}>
            <div className="warning-modal-content">
                <p>This is a warning message!</p>
                <button className="warning-acknowledge" onClick={closeModal}>
                    I Acknowledge
                </button>
            </div>
        </div>
    );
};

// Navbar Component
const Navbar = () => {
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const openModal = () => {
        setShowModal(true);
        setIsVisible(true);
    };

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => setShowModal(false), 500); // Wait for the fade-out transition to complete
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
                <button className="warning-btn" onClick={openModal}>Show Warning</button>
                {showModal && <WarningModal closeModal={closeModal} isVisible={isVisible} />}
            </div>
        </nav>
    );
};

export default Navbar;
