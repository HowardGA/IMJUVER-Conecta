const SideBarLessons = ({ modules, onModuleSelect, selectedModuleId, onLessonSelect, selectedLessonId }) => {
    return (
        <div className="sidebar-lessons">
            {modules.map(module => (
                <div key={module.mod_id} className="module-block">
                    <div
                        className={`module-title ${selectedModuleId === module.mod_id ? 'selected' : ''}`}
                        onClick={() => onModuleSelect(module)}
                    >
                        {module.nombre} {/* <-- aquí era `titulo`, ahora correcto */}
                    </div>
                    <ul className="lesson-list">
                        {module.lecciones.map(lesson => (
                            <li
                                key={lesson.lec_id}
                                className={`lesson-item ${selectedLessonId === lesson.lec_id ? 'selected' : ''}`}
                                onClick={() => onLessonSelect(lesson, module)}
                            >
                                {lesson.titulo}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default SideBarLessons;
