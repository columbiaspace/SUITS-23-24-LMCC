import React from "react";
import { NavLink as Link } from "react-router-dom";
import './navbar.css';

const Navbar = () => {
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
            </div>
        </nav>
    );
};

export default Navbar;
