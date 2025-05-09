import React from 'react';
import './Card.css';

const Card = ({ title, description, imagePath }) => {
    return (
        <div className="card">
            <img src={imagePath} alt={title} className="card__image" />
            <div className="card__content">
                <h2 className="card__title">{title}</h2>
                <p className="card__description">{description}</p>
            </div>
        </div>
    );
}

export default Card;
