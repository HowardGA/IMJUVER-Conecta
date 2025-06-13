import PlaceholderImage from '../../../assets/placeholders/img-placeholder.png';
import { useGetAllCategories } from '../../../api/catCourses/catCoursesHooks.js';


const CourseDetailsSteps = ({ previewURL, handleImageChange, methods }) => {
    const { register, watch, formState: { errors } } = methods;
    const courseName = watch('titulo') || 'Titulo';
    const courseDescription = watch('descripcion') || 'Descripción';
    const {data, isLoading} = useGetAllCategories();

  const headerStyle ={
        backgroundImage: previewURL 
            ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${previewURL})`
            : `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${PlaceholderImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '30%',
        width: '100%',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px'
    };




  return (
    <>
    {isLoading ?( <div className="spinner"></div>) :
       (
        <>
        <section className="hero-course__section">
                <h1>Previsualización del encabezado: </h1>
                <div style={headerStyle}>
                        <h1 className="hero-course__title">{courseName}</h1>
                        <p className="hero-course__description">{courseDescription}</p>
                        <button className="btn">Inscribirse</button>
                </div>
            </section>
      
       <section className="create-course__form">
                <h1>Datos del curso</h1>
                    <div className='form-grid'>
                        <div className='form-grid__item'>
                        <div className='login__input'>
                            <div className='error-form-course'>
                                <label className='label__createCourse'>Titulo <p className='required'/></label>
                                {errors.titulo && <span className="error-message-course">{errors.titulo.message}</span>}
                            </div>
                            <input 
                                type="text" 
                                placeholder='Titulo del curso' 
                                {...register('titulo', { 
                                    required: 'El titulo es requerido',
                                    minLength: {
                                        value: 8,
                                        message: 'Nombre debe tener al menos 8 caracteres'
                                    } })} 
                                />
                        </div>

                        <div className='login__input'>
                            <div className='error-form-course'>
                                <label className='label__createCourse'>Descripción <p className='required'/></label>
                                {errors.descripcion && <span className="error-message-course">{errors.descripcion.message}</span>}
                            </div>
                            <input
                            type='text'
                            placeholder='Descripción del curso'
                            {...register('descripcion', {
                                required: 'La descripción es requerida',
                                minLength: {
                                    value: 20,
                                    message: 'Descripción debe tener al menos 20 caracteres'
                                } })}
                            />
                        </div>

                        <div className='login__input'>
                            <div className='error-form-course'>
                                <label className='label__createCourse'>Imagen <p className='required'/></label>
                            </div>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageChange}
                            />
                        </div>
                        </div>
                        <div className='form-grid__item'>
                            <div className='login__input'>
                                <div className='error-form-course'>
                                    <label className='label__createCourse'>Categoria <p className='required'/></label>
                                    {errors.categoria && <span className="error-message-course">{errors.categoria.message}</span>}
                                </div>
                                <select 
                                    className='select__createCourse'
                                    {...register('cat_cursos_id', { 
                                        required: 'La categoría es requerida',
                                     })} 
                                    >
                                      {
                                        data.data.map((category) => (
                                                <option key={category.cat_cursos_id} value={category.cat_cursos_id}>{category.nombre}</option>
                                            ))
                                        }
                                       
                                </select>
                            </div>
                            <div className='login__input'>
                                <div className='error-form-course'>
                                    <label className='label__createCourse'>Duración <p className='required'/></label>
                                    {errors.duracion && <span className="error-message-course">{errors.duracion.message}</span>}
                                </div>
                                <input
                                type='number'
                                    placeholder='Duración en horas'
                                    {...register('duracion', {
                                        required: 'La duración es requerida',
                                        min: {
                                            value: 1,
                                            message: 'La duración debe ser al menos 1 hora'
                                    }})}
                                />
                            </div>
                            <div className='login__input'>
                                <div className='error-form-course'>
                                    <label className='label__createCourse'>Nivel <p className='required'/></label>
                                    {errors.nivel && <span className="error-message-course">{errors.nivel.message}</span>}
                                </div>
                                <select 
                                    className='select__createCourse'
                                    {...register('nivel', { 
                                        required: 'El nivel es requerido'})} 
                                    >
                                        <option value="0">Seleccione un nível</option>
                                        <option value="Principiante">Principiante</option>
                                        <option value="Intermedio">Intermedio</option>
                                        <option value="Avanzado">Avanzado</option>
                                </select>
                            </div>
                         </div>
                         </div>
            </section>
            </>
        )}
    </>
  );
};

export default CourseDetailsSteps;