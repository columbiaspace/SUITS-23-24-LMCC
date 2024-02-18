// BNavbarElements.js
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const BButton = styled.nav`
    background: darkblue;
    height: 75px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem; /* Adjusted padding */
    z-index: 12;
    position: fixed;
    bottom: 0;
    width: 100%;
`;

export const BButtonButton = styled.button`
    color: #808080;
    background: none;
    border: none;
    width: 2rem; /* Fixed width for square buttons */
    height: 2rem; /* Fixed height for square buttons */
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: italic;
    cursor: pointer;
    transition: color 0.2s ease-in-out;

    &:hover {
        color: white; /* Change color on hover */
    }

    &.active {
        color: #69b3e7;
    }
`;

export const BottomLink = styled(Link)`
    color: #808080;
    text-decoration: none;
    width: 2rem; /* Fixed width for square buttons */
    height: 2rem; /* Fixed height for square buttons */
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: italic;
    transition: color 0.2s ease-in-out;

    &:hover {
        color: white; /* Change color on hover */
    }

    &.active {
        color: #69b3e7;
    }
`;

export const BottomButtonMenu = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 3rem; /* Adjusted padding on the right */
    padding-left: 1rem; /* Adjusted padding on the left */
`;
