// BNavbar.js
import React from "react";
import { BottomButtonMenu, BButtonButton, BButton } from "./BottomButtonsElements"; // Add BNavButton import
import { useNavigate, useLocation } from "react-router-dom";
import './bottombuttons.css';

const BottomButtons = () => {
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
            <BButton>
                <BottomButtonMenu>
                    {pageButtonMap[location.pathname] && pageButtonMap[location.pathname].map((buttonLink, index) => (
                        <BButtonButton key={index} onClick={() => handleButtonClick(buttonLink)} className="bnav-link">
                            {index % 2 === 0 ? '◄' : '►'} {buttonLink.split('/')[1]}
                        </BButtonButton>
                    ))}
                </BottomButtonMenu>
            </BButton>
        </>
    );
};

export default BottomButtons;
