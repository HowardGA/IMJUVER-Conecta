import React from 'react';
import Card from '../../components/Card/Card';
import { useNavigate } from 'react-router-dom';
import JS from '../../assets/placeholders/code.jpeg';
import Grid from '../../components/Grid/Grid';
import './Courses.css';
import { useGetCourses } from '../../api/courses/coursesHooks';
import { useAuth } from '../../context/AuthContext';

const Courses = () => {
   const navigate = useNavigate();
    const { data: courses, isLoading, isError } = useGetCourses();
    const {user} = useAuth();
    const {rol_id} = user;
   
    return(
        <>
        {isLoading ? (<div className='spinner'></div>):
            (<div className="courses__page container">
            <nav className='courses__nav'>
                    <div className='courses__search'>
                        <input type="text" placeholder='Buscar cursos' className='searchBar'/>
                  
                        <button className='btn'>
                            <div className='searchIcon'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                            </svg>
                            </div>
                        </button>
                    </div>

                <div className='courses__actions'>
                    { rol_id == 1 &&
                        <button className='btn' onClick={() => navigate('/courses/create')}>
                        <div className='searchIcon'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </button>
                    }

                    <select name="category" id="category">
                            <option value="0">Filtre por categoría:</option>
                            <option value="1">Informatica</option>
                            <option value="2">Derecho</option>
                    </select>
                </div>
            </nav>
                
                <Grid>
                    {courses.data.map((course) => {
                        return(
                            <Card key={course.curs_id} title={course.titulo} description={course.descripcion} imagePath={course.portada.url} courseID={course.curs_id} modulos={course.modulos}/>
                        )
                    })}
                   
                </Grid>
           
        </div>)}
        </>
    );
}

export default Courses;