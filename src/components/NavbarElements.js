import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const Nav = styled.nav`
    background: darkblue;
    height: 75px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    z-index: 12;
`;

export const NavLink = styled(Link)`
    color: #808080;
    text-decoration: none;
    padding: 1rem; 
    font-weight: bold; 
    transition: color 0.2s ease-in-out;
    
    &:hover {
        color: white; /* Change color on hover */
    }
    
    &.active {
        color: #69b3e7;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    align-items: center;
`;
