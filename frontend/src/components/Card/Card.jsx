import { useNavigate } from 'react-router-dom';
import './Card.css';
import { useAuth } from '../../context/AuthContext';

const Card = ({ title, description, imagePath, courseID, modulos }) => {
    const navigate = useNavigate();
     const {user} = useAuth();
    const {rol_id} = user;

    const handleCardClick = (courseId) => {
        const courseData = {
            title: title,
            description: description,
            imagePath: imagePath,
            courseID: courseID,
            modulos: modulos
        };
        rol_id == 1 ? navigate(`create/lessons`, {state: {modulos}}) : navigate(`/courses/${courseId}`,{state: { courseData }});
      // 
    }


    return (
        <div className="card" onClick={() => {handleCardClick(courseID)}}>
            <img src={imagePath} alt={title} className="card__image" />
            <div className="card__content">
                <h2 className="card__title">{title}</h2>
                <p className="card__description">{description}</p>
            </div>
        </div>
    );
}

export default Card;
