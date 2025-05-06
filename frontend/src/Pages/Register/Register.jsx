import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import '../Login/Login.css';
import Logo from '../../assets/logo.png';

const Register = () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    }
    
return (
        <div className="login__page ">
            <div className='register__container container'>
                <div className='register__formColumn'>
                    <img src={Logo} alt="Logo" className='login__logo'/>
                    <h1>Registro</h1>
                        <p className='centerText'>Registra tus datos para crear una cuenta y gozar de las nuevas ventajas que ofrece la plataforma de IMJUVER</p>
                        <div className='login__register'>
                                <p >¿Ya tienes cuenta? <a className='link' onClick={navigateToLogin}>Inicia Sesión</a></p>
                        </div>
                </div>

                <div className='register__formColumn'>
                    <section className='register__form'>
                        <form>
                            <div className='login__input'>
                                <label>Nombre</label>
                                <input type="text" id="name" className='login__field' placeholder='Howard'/>
                            </div>
                            <div className='login__input'>
                                <label>Apellido</label>
                                <input type="text" id="last-name" className='login__field' placeholder='Garcia'/>
                            </div>
                            <div className='login__input'>
                                <label>Telefono</label>
                                <input type="number" id="name" className='login__field' placeholder='(661)-234-5678'/>
                            </div>
                            <div className='login__input'>
                                <label htmlFor='date'>Fecha de Nacimiento</label>
                                <input type="date" id="birthdate" className='login__field'/>
                            </div>
                            <div className='login__input'>
                                <label>Nivel Educativo</label>
                                <input type="" id="name" className='login__field' placeholder='Seleccionar'/>
                            </div>
                            <div className='login__input'>
                                <label htmlFor="email">Correo Electrónico</label>
                                <input type="email" id="email" className='login__field' placeholder='Ejemplo@gmail.com'/>
                            </div>
                            <div className='login__input'>
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" id="password" className='login__field' placeholder='Ingrese su contraseña'/>
                            </div>
                            <div className='login__input'>
                                <label htmlFor="password">Confirma tu Contraseña</label>
                                <input type="password" id="password" className='login__field' placeholder='Ingrese su contraseña de nuevo'/>
                            </div>
                            <div className='login__input'>
                                <button type="submit" className='login__btn'>Registrar</button>
                            </div>
                        
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Register;