import HeroCourse from "./HeroCourse";
import { useParams } from "react-router-dom";
import LessonsList from "./LessonsList";
import './CoursesComponents.css';

const ChoosenCourse = ({course}) => {

    const lessonsData = [
        { id: 1, title: "Variables y constantes", description: "Description of Lesson 1 - More detailed content here." },
        { id: 2, title: "Operadores lógicos", description: "Description of Lesson 2 - Even more information can be added." },
        { id: 3, title: "Palabras reservadas", description: "Description of Lesson 3 - And so on for each lesson." },
        { id: 4, title: "Condicionales", description: "Description of Lesson 4 - You get the idea!" },
        { id: 5, title: "Ternarios", description: "Description of Lesson 5 - This is the last one for now." }
      ];


    return (
        <div className="choosen-course container">
        <HeroCourse/>
            <div className="choosen-course__content">
                <p className="choosen-course-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi cupiditate sit, aperiam voluptatum a maiores dolores saepe molestias voluptates totam quos minima, itaque nobis error animi blanditiis. Quo, id modi! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id aliquid fugiat eveniet sed eaque provident sequi, illo iste odio fuga voluptate neque? Vitae veniam vel, vero numquam nemo fugit aspernatur!</p>
                <LessonsList lessons={lessonsData}/>
            </div> 
        </div>
    );
}

export default ChoosenCourse;