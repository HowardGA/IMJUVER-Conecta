import './CoursesComponents.css';

const HeroCourse = ({title, description, imagePath}) => {

    const imageURL = imagePath ? imagePath.replace(' ', '%20') : '';
    const headerStyle ={
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '30%',
        width: '100%',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageURL})`,
    }
    return (
        <div style={headerStyle}>
                <h1 className="hero-course__title">{title}</h1>
                <p className="hero-course__description">{description}</p>
                <button className="btn">Inscribirse</button>
        </div>
    )
};

export default HeroCourse;