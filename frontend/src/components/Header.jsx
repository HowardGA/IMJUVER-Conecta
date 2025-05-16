import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Utils.css';
import './Header.css';
import './Mobile-nav.css';
import Logo from '../assets/logo-white.png';
import {useAuth} from '../context/AuthContext.jsx';

const Header = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();

    const handleMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigateToLogin = () => {
        if (user) {
            navigate('/profile');
            return;
        }
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
                         {user ? (
                            <button className="profileIcon__header" onClick={navigateToLogin}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clipRule="evenodd" />
                            </svg>
                            </button>

                    ):(
                        <button className="btn" onClick={navigateToLogin}>
                            Acceder
                        </button>
                    )}
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
                        <button className='profileIcon__header' onClick={navigateToLogin}>
                                {user ? (
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clipRule="evenodd" />
                        </svg>

                    ):(
                        Acceder
                    )}
                        </button>
                    </li>

                </ul>
            </nav>
        </div>}
        </>
    );
};
export default Header;