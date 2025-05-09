import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useVerifyEmail } from '../../assets/api/auth/authHooks';
import './emailConfirmation.css';
import '../Register/Register.css';
import Logo from '../../assets/logo.png';

const EmailConfirmation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { mutateAsync: verifyEmail } = useVerifyEmail();
    const [title, setTitle] = useState('Verificando tu correo...');
    const [message, setMessage] = useState('Estamos activando tu cuenta en INJUVER Conecta');
    const [countdown, setCountdown] = useState(5);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        // 1. First show the initial message for 2 seconds
        const initialDelay = setTimeout(() => {
            setIsVerifying(true);
            
            // 2. Then start the verification process
            const handleVerification = async () => {
                try {
                    await verifyEmail(token);
                    
                    // Success state
                    setTitle('¡Cuenta verificada con éxito!');
                    setMessage('Tu correo electrónico ha sido verificado correctamente.');
                    
                    // Start countdown before redirect
                    const timer = setInterval(() => {
                        setCountdown(prev => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                navigate('/login');
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                } catch (error) {
                    console.error('Error verifying email:', error);
                    
                    if (error.response?.status === 403) {
                        setTitle('Error de verificación');
                        setMessage('El enlace es inválido o ha expirado. Por favor solicita un nuevo enlace de verificación.');
                    } else {
                        setTitle('Error en el servidor');
                        setMessage('Ocurrió un problema al verificar tu cuenta. Por favor intenta nuevamente más tarde.');
                    }
                    
                    toast.error(error.response?.data?.message || 'Error al verificar el correo');
                }
            };

            handleVerification();
        }, 2000); // 2-second delay before starting verification

        return () => clearTimeout(initialDelay); // Cleanup
    }, [token, navigate, verifyEmail]);

    return (
        <div className="login__page">
            <ToastContainer />
            <div className='register__container container'>
                <div className='emailConfirmation__Column'>
                    <img src={Logo} alt="Logo" className='login__logo'/>
                    <h1 className='login__title'>{title}</h1>
                    <p className='centerText'>{message}</p>
                    
                    {/* Loading spinner during verification */}
                    {isVerifying && !title.includes('éxito') && !title.includes('Error') && (
                        <div className="spinner"></div>
                    )}
                    
                    {countdown > 0 && title.includes('éxito') && (
                        <p className='timer'>Redirigiendo en {countdown} segundos...</p>
                    )}
                    
                    {title.includes('Error') && (
                        <button 
                            className='login__button'
                            onClick={() => navigate('/resend-verification')}
                        >
                            Solicitar nuevo enlace
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;