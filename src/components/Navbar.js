import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
import './navbar.css';

const Navbar = () => {
    return (
        <>
            <Nav style={{ height: '10vh' }}>
                <NavMenu>
                    <img className="img" src={require("./../assets/Images/logo.jpg")} alt="Logo"/>
                    <h1 id="title">CUITS 2024 LMCC</h1>
                    <NavLink to="/Constant" activeStyle>
                        Constant
                    </NavLink>
                    <NavLink to="/Setup" activeStyle>
                        Setup
                    </NavLink>
                    <NavLink to="/Egress" activeStyle>
                        Egress
                    </NavLink>
                    <NavLink to="/Nav" activeStyle>
                        Nav
                    </NavLink>
                    <NavLink to="/Equipment" activeStyle>
                        Equipment
                    </NavLink>
                    <NavLink to="/Rocks" activeStyle>
                        Rocks
                    </NavLink>
                    <NavLink to="/Rover" activeStyle>
                        Rover
                    </NavLink>
                    <NavLink to="/Ingress" activeStyle>
                        Ingress
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;
