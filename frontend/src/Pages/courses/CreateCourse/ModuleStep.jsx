import { useFieldArray } from 'react-hook-form';


const ModulesStep = ({ methods }) => {
  const { register, control,watch, setValue } = methods;
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "modulos"
  });

  const moduleTitle = watch('modulos.titulo') || 'Titulo';
  const moduleDescription = watch('modulos.descripcion') || 'Descripción';

   const handleMoveUp = (index) => {
    if (index > 0) {
      swap(index, index - 1);
    }
  };

  const handleMoveDown = (index) => {
    if (index < fields.length - 1) {
      swap(index, index + 1);
    }
  };

  return (
    <section className="modules-form container">
      <h1>Módulos del Curso</h1>

      <div className='form-grid'>
        <div className='form-grid__item'>
        <p >Agrega los módulos que componen el curso. Puedes añadir o eliminar módulos según sea necesario.</p>

        <div className='login__input'>
            <label className='label__createCourse'>Titulo <p className='required'/></label>
            <input 
                type="text" 
                placeholder='Titulo del módulo' 
                {...register('modulos.titulo')} 
                />
        </div>

        <div className='login__input'>
            <label className='label__createCourse'>Descripción <p className='required'/></label>
            <input 
                type="text" 
                placeholder='Descripción de módulo' 
                {...register('modulos.descripcion')} 
                />
        </div>

        <button 
            type="button"
            className='btn'         
            onClick={(e) => {
              e.preventDefault(); 
              e.stopPropagation();
              append({ titulo: moduleTitle, descripcion: moduleDescription });
              setValue('modulos.titulo', ''); 
              setValue('modulos.descripcion', '');}}
            >Añadir módulo
        </button>
    </div>
    <div className='form-grid__item'>
        <div className='modules-list'>
            {fields.map((field, index) => (
                <div key={field.id} className="module-item">
                  <div className='module-item__buttons'>
                    <button type="button" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                      <div className='gray-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>

                    <button type="button" onClick={() => remove(index)}>
                        <div className='trash-icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </button>

                    <button type="button" onClick={() => handleMoveDown(index)} disabled={index === fields.length - 1}>
                      <div className='gray-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className='module-info'>
                        <h3>Módulo {index + 1}</h3>
                        <h3>{field.titulo}</h3>
                        <p className='golden-txt'>{field.descripcion}</p>
                    </div>
                </div>
            ))}
      </div>
      </div>
      </div>
    </section>
  );
};

export default ModulesStep;