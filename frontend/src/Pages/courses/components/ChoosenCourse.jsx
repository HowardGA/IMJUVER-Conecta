import HeroCourse from "./HeroCourse";
import { useLocation } from "react-router-dom";
import LessonsList from "./LessonsList";
import { useGetLessonsbyModule } from "../../../api/courses/coursesHooks";
import './CoursesComponents.css';

const ChoosenCourse = () => {
    const location = useLocation();
    const {courseData} = location.state || {};
    const { title, description, imagePath, courseID, modulos } = courseData || {};
    const {data: lessons, isLoading, isError} = useGetLessonsbyModule(courseID);

    return (
        <div className="choosen-course container">
        <HeroCourse title={title} description={description} imagePath={imagePath}/>
            <div className="choosen-course__content">
                {
                    isLoading ? (<p>Loading...</p>) : (<LessonsList lessons={lessons.data || []} courseID={courseID} />)
                }
                
            </div> 
        </div>
    );
}

export default ChoosenCourse;