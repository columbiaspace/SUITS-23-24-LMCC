// BNavbar.js
import React from "react";
import { BNav, BNavMenu, BNavButton } from "./BNavbarElements"; // Add BNavButton import
import { useNavigate, useLocation } from "react-router-dom";
import './bnavbar.css';

const BNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const pageButtonMap = {
        '/Focus': ['/Constant', '/TSS'],
        '/TSS': ['/Ingress', '/Egress'],
        '/Egress': ['/TSS', '/Nav'],
        '/Nav': ['/Egress', '/Equipment'],
        '/Equipment': ['/Nav', '/Rocks'],
        '/Rocks': ['/Equipment', '/Rover'],
        '/Rover': ['/Rocks', '/Ingress'],
        '/Ingress': ['/Rover', '/TSS']
    };

    const handleButtonClick = (url) => {
        navigate(url);  // Use React Router's navigate function to navigate to the specified URL
    };

    return (
        <>
            <BNav>
                <BNavMenu>
                    {pageButtonMap[location.pathname] && pageButtonMap[location.pathname].map((buttonLink, index) => (
                        <BNavButton key={index} onClick={() => handleButtonClick(buttonLink)} className="bnav-link">
                            {index % 2 === 0 ? '◄' : '►'} {buttonLink.split('/')[1]}
                        </BNavButton>
                    ))}
                </BNavMenu>
            </BNav>
        </>
    );
};

export default BNavbar;
