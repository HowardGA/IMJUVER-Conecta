import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LessonsList = ({ lessons, courseID }) => {
  const navigate = useNavigate();
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  const toggleExpand = (modId) => {
    setExpandedModuleId(expandedModuleId === modId ? null : modId);
  };
console.log(lessons)
  const handleLessonClick = (lessonId, title) => {
    navigate(`/courses/${courseID}/lessons/${lessonId}`, {
      state: { lessonTitle: title }
    });
  };

  return (
    <div className="lessons-list">
      {lessons.map((module) => (
        <div key={module.mod_id} className="lesson-item">
          <div className="lesson-header" onClick={() => toggleExpand(module.mod_id)}>
            <h3 className="list-title">{module.titulo}</h3>
            <div className="list-icon">
              {expandedModuleId !== module.mod_id ? (
                <svg /* down arrow */ xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              ) : (
                <svg /* up arrow */ xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
              )}
            </div>
          </div>

          <div
            className="list-content"
            style={{
              maxHeight: expandedModuleId === module.mod_id ? '1000px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease-in-out'
            }}
          >
            {module.lecciones.length > 0 ? (
              module.lecciones.map((lesson) => (
                <div key={lesson.lec_id} className="lesson-item-child">
                  <p>{lesson.titulo}</p>
                  <div className="lesson-btn-container">
                    <button
                      className="lesson-btn btn"
                      onClick={() => handleLessonClick(lesson.lec_id, lesson.titulo)}
                    >
                      Comenzar lección
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-lessons">Este módulo no tiene lecciones.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonsList;
