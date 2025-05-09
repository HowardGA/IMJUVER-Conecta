import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Utils.css';
import './Header.css';
import './Mobile-nav.css';
import Logo from '../assets/logo-white.png';

const Header = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const handleMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigateToLogin = () => {
        navigate('/login');
    }

    const menuNavigate = (path) => {
        navigate(path);
    }
  

    return (
        <>
        <header className="header container">
            <nav>
            <img src={Logo} alt="Logo" className="header__logo" />

            <ul className="header__menu">
                <li></li>
                <li>
                    <a className="header__link" onClick={() => {menuNavigate("courses")}}>Cursos</a>
                </li>
                <li>
                    <a className="header__link">Bolsa de Trabajo</a>
                </li>
                <li>
                    <a className="header__link">Directorio</a>
                </li>
                <li>
                    <a className="header__link">Propuestas</a>
                </li>
                <li>
                    <a className="header__link">Foro</a>
                </li>
                <li>
                    <button className='btn' onClick={navigateToLogin}>Acceder</button>
                </li>
                
            </ul>
                <button className="header__bars" onClick={handleMenuToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </nav>
        </header>

     {isMobileMenuOpen &&
        <div className="header__mobile">
            <nav>
                <ul className="header-mobile__menu">
                    <li>
                        <a className="mobile-nav__link" href="/">Home</a>
                    </li>
                    <li>
                        <a className="mobile-nav__link" href="/">Cursos</a>
                    </li>
                    <li>
                        <a className="mobile-nav__link" href="/">Bolsa de Trabajo</a>
                    </li>
                    <li>
                        <a className="mobile-nav__link" href="/">Directorio</a>
                    </li>
                    <li>
                        <a className="mobile-nav__link" href="/">Propuestas</a>
                    </li>
                    <li>
                        <a className="mobile-nav__link" href="/">Foro</a>
                    </li>
                    <li>
                        <button className='btn' onClick={navigateToLogin}>Acceder</button>
                    </li>

                </ul>
            </nav>
        </div>}
        </>
    );
};
export default Header;