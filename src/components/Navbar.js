import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
import './navbar.css'

 
const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                <img className="img" src={require("./../assets/logo.jpg")} alt="Logo"/>
                    <NavLink to="/Constant" activeStyle>
                        Constant
                    </NavLink>
                    <NavLink to="/TSS" activeStyle>
                        TSS
                    </NavLink>
                    <NavLink to="/Rover" activeStyle>
                        Rover
                    </NavLink>
                    <NavLink to="/Rocks" activeStyle>
                        Rocks
                    </NavLink>
                    <NavLink to="/Nav" activeStyle>
                        Nav
                    </NavLink>
                    <NavLink to="/Ingress" activeStyle>
                        Ingress
                    </NavLink>
                    <NavLink to="/Focus" activeStyle>
                        Focus
                    </NavLink>
                    <NavLink to="/Equipment" activeStyle>
                        Equipment
                    </NavLink>
                    <NavLink to="/Egross" activeStyle>
                        Egross
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;