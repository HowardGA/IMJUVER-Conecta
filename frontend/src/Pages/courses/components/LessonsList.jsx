import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LessonsList = ({ lessons }) => {
    const navigate = useNavigate();
    const [expandedLessonId, setExpandedLessonId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedLessonId(expandedLessonId === id ? null : id);
    };

    //the 1 is the current course id, this should be dynamic
    const handleLessonClick = (lessonId, title) => {
        navigate(`/courses/1/lessons/${lessonId}`, { state: { lessonTitle: title } });
    }

  return (
    <div className="lessons-list">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="lesson-item">
            <div className='lesson-header' onClick={() => toggleExpand(lesson.id)}>
                <h3 className="list-title">
                    {lesson.title}
                </h3>
                {expandedLessonId != lesson.id ? (
                    <div className='list-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                ):(
                     <div className='list-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                     </div>
                )
                }
            </div>
          <div
            className="list-content"
            style={{
              maxHeight: expandedLessonId === lesson.id ? '6rem' : '0', 
              overflow: 'hidden',
              transition: 'max-height 0.4s ease-in',
            }}
          >
            <p>{lesson.description}</p>
                <div className='lesson-btn-container'>
                    <button className="lesson-btn btn" onClick={() => {handleLessonClick(lesson.id, lesson.title)}}>Comenzar leección</button>
                </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonsList;