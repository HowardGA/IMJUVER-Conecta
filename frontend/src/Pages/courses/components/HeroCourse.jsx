import './CoursesComponents.css';
import JS from '../../../assets/placeholders/code.jpeg';

const HeroCourse = () => {

    const headerStyle ={
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${JS})`,
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
        padding: '20px'
    }

    return (
        <div style={headerStyle}>
                <h1 className="hero-course__title">Curso de JavaScript</h1>
                <p className="hero-course__description">Aprende los fundamentos de JavaScript y comienza a desarrollar aplicaciones web interactivas.</p>
                <button className="btn">Inscribirse</button>
        </div>
    )
};

export default HeroCourse;