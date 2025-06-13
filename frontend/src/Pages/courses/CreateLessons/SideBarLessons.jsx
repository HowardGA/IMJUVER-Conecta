import './styles/SideBarLessons.css';

const SideBarLessons = ({modules, onModuleSelect, selectedModuleId}) => {
    console.log(selectedModuleId);
    return (
        <aside className="sidebar">
            <h1>Modulos</h1>
            <p className='instructions'>Selecciona un modulo para crear lecciones</p>
            <ul>
                {modules.map((module, index) => (
                    <div key={module.id} className={`module-item ${module.mod_id === selectedModuleId ? 'active' : ''}`} onClick={() => onModuleSelect(module)}>
                        <div className='module-info'>
                            <h3>Módulo {index + 1}</h3>
                            <h3>{module.titulo}</h3>
                            <p className='golden-txt'>{module.descripcion}</p>
                        </div>
                    </div>
                ))}
            </ul>
        </aside>
    );
}

export default SideBarLessons;