import { useLocation, useParams } from 'react-router-dom';
import { useGetLessonDetails } from '../../api/courses/coursesHooks';
import YoutubeEmbeded from './components/YoutubeEmbeded';
import './SpecificLesson.css';
import LessonContent from './components/LessonContent';
import VideoCarousel from './components/VideoCarousel';

const SpecificLesson = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const lessonTitle = location.state?.lessonTitle;

  const { data: lesson, isLoading, isError } = useGetLessonDetails(lessonId);


  if (isLoading) return <div>Cargando lección...</div>;
  if (isError || !lesson) return <div>Error al cargar la lección.</div>;

  console.log(lesson.data)

  const { videos, contenido, archivos } = lesson.data;

  return (
    <div className="specific-lesson container">
      <div className="lesson-title">
        <h1>{lessonTitle || lesson.data.titulo}</h1>
        <button className="btn">Cuestionario</button>
      </div>

    <div className='content-container'>
      {/* Videos carousel */}
      <div className='video-container'>
      <VideoCarousel videos={videos}/>
      </div>

      <div className="lesson-content">
        <LessonContent content={JSON.parse(contenido)} />
      </div>

      {archivos.length > 0 && (
        <div className="lesson-files">
          <h3 className='subtitle'>Archivos adjuntos</h3>
          <ul>
            {archivos.map((file, index) => (
              <li key={index}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
};

export default SpecificLesson;
