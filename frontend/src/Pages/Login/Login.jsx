import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Logo from '../../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();

    const navigateToRegister = () => {
        navigate('/register');
    }

    return (
        <div className="login__page ">
            <div className='login__container container'>
                <img src={Logo} alt="Logo" className='login__logo'/>
                <h1 className='login__title'>Iniciar Sesión</h1>
                <section className='login__form'>
                    <form>
                        <div className='login__input'>
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" className='login__field' placeholder='Ejemplo@gmail.com'/>
                        </div>
                        <div className='login__input'>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" className='login__field' placeholder='Ingrese su contraseña'/>
                        </div>
                        <div className='login__input'>
                            <button type="submit" className='login__btn'>Iniciar Sesión</button>
                        </div>
                        <div className='login__register'>
                            <p >¿No tienes una cuenta? <a className='link' onClick={navigateToRegister}>Regístrate</a></p>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Login;