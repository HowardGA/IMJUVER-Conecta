import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Logo from '../../assets/logo.png';
import { useForm } from 'react-hook-form';
import { useLogin } from '../../api/auth/authHooks';
import { toastService } from '../../utils/Toast';
import { ClipLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const {mutateAsync: login, isLoading, error} = useLogin();
    const { loginAuth } = useAuth();


        useEffect(() =>{
            if (error) {
                toastService.error(error.message);
                console.error("Error during login:", error);
            }
        },[error]);

    const { register, handleSubmit,formState: { errors } } = useForm();

    const navigateToRegister = () => {
        navigate('/register');
    }

    const onSubmit = async (data) => {
        try {
            console.log("Data to be sent:", data);
            const response = await login(data);
            if (response) {
                loginAuth(response.data.user);
                toastService.success(response.data.message);
                navigate('/');
            }

        } catch (e) {
            console.error("Error during login:", e);
        }
    }

    return (
        <div className="login__page ">
            <ToastContainer />
            <div className='login__container container'>
                <img src={Logo} alt="Logo" className='login__logo'/>
                <h1 className='login__title'>Iniciar Sesión</h1>
                <section className='login__form'>

                    <form onSubmit={handleSubmit(onSubmit)} className='login__form'>
                        <div className='login__input'>
                            <label htmlFor="email">Correo Electrónico</label>
                            <input 
                                type="email" 
                                id="email" 
                                className='login__field' 
                                placeholder='Ejemplo@gmail.com'
                                {...register('email', {
                                    required: 'Este campo es obligatorio',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Ingrese un correo electrónico válido'
                                    },
                                })}
                                />
                            {errors.email && <span className="error-message">{errors.email.message}</span>}    
                        </div>
                        <div className='login__input'>
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                className='login__field' 
                                placeholder='Ingrese su contraseña'
                                {...register('password', {
                                    required: 'Este campo es obligatorio',
                                    
                                })}
                                />
                            {errors.password && <span className="error-message">{errors.password.message}</span>}
                        </div>

                        <div className='login__input'>
                            <button type="submit" className='login__btn' disabled={isLoading}>
                                   {isLoading ? (
                                    <>
                                        <ClipLoader 
                                            color="#ffffff" 
                                            size={20} 
                                            cssOverride={{ marginRight: '8px' }} 
                                        />
                                        Procesando...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                                </button>
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