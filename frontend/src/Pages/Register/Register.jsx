import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Register.css';
import '../Login/Login.css';
import Logo from '../../assets/logo.png';
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRegister } from '../../assets/api/auth/authHooks';

const Register = () => {
    const navigate = useNavigate();
    const { mutateAsync: registration, isPending, error } = useRegister();

    useEffect(() =>{
        if (error) {
            showToastMessage(error.message, "error");
        }
    },[error]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nombre: '',
            apellido: '',
            rol_id: 2,
            telefono: '',
            fecha_nacimiento: '',
            nivel_educativo: '',
            email: '',
            password: '',
        }
    });

    const navigateToLogin = () => {
        navigate('/login');
    }

    const showToastMessage = (message, type) => {
        const toastOptions = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          };
      
          if (type === "success") {
            toast.success(message, toastOptions);
          } else if (type === "error") {
            toast.error(message, toastOptions);
          }
      };

    const onSubmit = async (data) => {
        console.log(data);
        const response = await registration(data);
        showToastMessage(response.data.message, response.data.status);
        // check if the service takes us to login
    };
    
    return (
        <div className="login__page ">
            <ToastContainer />
            <div className='register__container container'>
                <div className='register__formColumn'>
                    <img src={Logo} alt="Logo" className='login__logo'/>
                    <h1 className='login__title'>Registro</h1>
                    <p className='centerText'>Registra tus datos para crear una cuenta y gozar de las nuevas ventajas que ofrece la plataforma de IMJUVER</p>
                    <div className='login__register'>
                        <p>¿Ya tienes cuenta? <a className='link' onClick={navigateToLogin}>Inicia Sesión</a></p>
                    </div>
                </div>

                <div  className='register__form'>
                    <section >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Name Field */}
                            <div className='login__input'>
                                <label >Nombre <p className='required'/></label>
                                <input 
                                    type="text" 
                                    className='login__field' 
                                    placeholder='Howard'
                                    {...register('nombre', { 
                                        required: 'Nombre es requerido',
                                        minLength: {
                                            value: 3,
                                            message: 'Nombre debe tener al menos 3 caracteres'
                                        }
                                    })}
                                />
                                {errors.name && <span className="error-message">{errors.name.message}</span>}
                            </div>
                            
                            {/* Last Name Field */}
                            <div className='login__input'>
                                <label >Apellido<p className='required'/></label>
                                <input 
                                    type="text" 
                                    className='login__field' 
                                    placeholder='Garcia'
                                    {...register('apellido', { 
                                        required: 'Apellido es requerido',
                                        minLength: {
                                            value: 3,
                                            message: 'Apellido debe tener al menos 3 caracteres'
                                        }
                                    })}
                                />
                                {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
                            </div>
                            
                            {/* Phone Field */}
                            <div className='login__input'>
                                <label>Telefono<p className='required'/></label>
                                <input 
                                    type="number" 
                                    className='login__field' 
                                    placeholder='(661)-234-5678'
                                    {...register('telefono', { 
                                        required: 'Teléfono es requerido',
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Teléfono debe tener 10 dígitos'
                                        }
                                    })}
                                />
                                {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                            </div>
                            
                            {/* Birthdate Field */}
                            <div className='login__input'>
                                <label htmlFor='date' >Fecha de Nacimiento<p className='required'/></label>
                                <input 
                                    type="date" 
                                    className='login__field'
                                    {...register('fecha_nacimiento', { 
                                        required: 'Fecha de nacimiento es requerida',
                                        validate: {
                                            validDate: (value) => {
                                                const selectedDate = new Date(value);
                                                const minDate = new Date();
                                                minDate.setFullYear(minDate.getFullYear() - 100);
                                                const maxDate = new Date();
                                                maxDate.setFullYear(maxDate.getFullYear() - 13);
                                                
                                                if (selectedDate < minDate) return 'Fecha no válida';
                                                if (selectedDate > maxDate) return 'Debes tener al menos 13 años';
                                                return true;
                                            }
                                        }
                                    })}
                                />
                                {errors.birthdate && <span className="error-message">{errors.birthdate.message}</span>}
                            </div>
                            
                            {/* Education Level Field */}
                            <div className='register__selectContainer'>
                                <label>Nivel Educativo</label>
                                <select 
                                    className='register__select'
                                    {...register('nivel_educativo')}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="primaria">Primaria</option>
                                    <option value="secundaria">Secundaria</option>
                                    <option value="preparatoria">Preparatoria</option>
                                    <option value="universidad">Universidad</option>
                                </select>
                            </div>
                            
                            {/* Email Field */}
                            <div className='login__input'>
                                <label htmlFor="email" >Correo Electrónico<p className='required'/></label>
                                <input 
                                    type="email" 
                                    className='login__field' 
                                    placeholder='Ejemplo@gmail.com'
                                    {...register('email', { 
                                        required: 'Correo electrónico es requerido',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Correo electrónico no válido'
                                        }
                                    })}
                                />
                                {errors.email && <span className="error-message">{errors.email.message}</span>}
                            </div>
                            
                            {/* Password Field */}
                            <div className='login__input'>
                                <label htmlFor="password" >Contraseña<p className='required'/></label>
                                <input 
                                    type="password" 
                                    className='login__field' 
                                    placeholder='Ingrese su contraseña'
                                    {...register('password', { 
                                        required: 'Contraseña es requerida',
                                        minLength: {
                                            value: 8,
                                            message: 'Contraseña debe tener al menos 8 caracteres'
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                            message: 'Debe contener al menos una mayúscula, una minúscula y un número'
                                        }
                                    })}
                                />
                                {errors.password && <span className="error-message">{errors.password.message}</span>}
                            </div>
                            
                            {/* Confirm Password Field */}
                            <div className='login__input'>
                                <label htmlFor="password" >Confirma tu Contraseña<p className='required'/></label>
                                <input 
                                    type="password" 
                                    className='login__field' 
                                    placeholder='Ingrese su contraseña de nuevo'
                                    {...register('confirmPassword', { 
                                        required: 'Debes confirmar tu contraseña',
                                        validate: (value) => 
                                            value === watch('password') || 'Las contraseñas no coinciden'
                                    })}
                                />
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
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