import React from 'react';
import Card from '../../components/Card/Card';
import { useNavigate } from 'react-router-dom';
import JS from '../../assets/placeholders/code.jpeg';
import Grid from '../../components/Grid/Grid';
import './Courses.css';

const Courses = () => {
   

    return(
        <div className="courses__page container">
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

                <select name="category" id="category">
                            <option value="0">Filtre por categoría:</option>
                            <option value="1">Informatica</option>
                            <option value="2">Derecho</option>
                        </select>
            </nav>
                
                <Grid>
                    <Card title='JavaScript' description='Curso de conocimientos basicos de java script CLICK' imagePath={JS} courseID={1}/>
                    <Card title='JavaScript' description='Curso de conocimientos basicos de java script palabra palabra eres tu jiji jaja sdfsdf  sfsd fsdf sdfs sdfsd adasdsad sdfsdf sdfsd sdf sdf sdfsdfs ' imagePath={JS} courseID={2}/>
                    <Card title='JavaScript' description='Curso de conocimientos basicos de java script' imagePath={JS} courseID={3}/>
                    <Card title='JavaScript' description='Curso de conocimientos basicos de java script' imagePath={JS} courseID={4}/>
                    <Card title='JavaScript' description='Curso de conocimientos basicos de java script' imagePath={JS} courseID={5}/>
                </Grid>
           
        </div>
    );
}

export default Courses;