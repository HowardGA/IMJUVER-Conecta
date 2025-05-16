import React from 'react';
import { useLocation } from 'react-router-dom';
import YoutubeEmbeded from './components/YoutubeEmbeded';
import './SpecificLesson.css';

const SpecificLesson = () => {
    const location = useLocation();
    const lessonTitle = location.state?.lessonTitle;
    const embededId = 'Iwiwl2ySwx8';


    return (
        <div className="specific-lesson container">
        <div className='lesson-title'>
            <h1>{lessonTitle}</h1>
            <button className='btn'>Cuestionario</button>
        </div>
        <div className='video-container'>
            <YoutubeEmbeded embedId={embededId}/>
        </div>
        </div>
    );
};

export default SpecificLesson;