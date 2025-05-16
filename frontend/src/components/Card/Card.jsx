import { useNavigate } from 'react-router-dom';
import './Card.css';

const Card = ({ title, description, imagePath, courseID }) => {
    const navigate = useNavigate();

    const handleCardClick = (courseId) => {
        console.log(courseId);
        navigate(`/courses/${courseId}`);
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
