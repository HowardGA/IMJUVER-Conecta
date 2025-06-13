import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Home from './Pages/Home/Home';
import Courses from './Pages/courses/Courses';
import EmailConfirmation from './Pages/emailConfirmation/emailConfirmation';
import './App.css';
import Profile from './Pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ChoosenCourse from './Pages/courses/components/ChoosenCourse.jsx';
import SpecificLesson from './Pages/courses/SpecificLesson.jsx';
import CreateCourse from './Pages/courses/CreateCourse/CreateCourse.jsx';
import CreateLessons from './Pages/courses/CreateLessons/CreateLessons.jsx';
import CreateQuizzes from './Pages/courses/createQuizz/CreateQuizzes.jsx';

function App() {

  return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/emailConfirmation/:token" element={<EmailConfirmation />} />
          <Route path="/" element={<Layout />}>

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

            <Route index element={<Home />} /> 
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:courseId" element={<ChoosenCourse />} />
            <Route path="courses/:courseId/lessons/:lessonId" element={<SpecificLesson />} />
            <Route path="courses/create" element={<CreateCourse />} />
            <Route path="courses/create/lessons" element={<CreateLessons />}/>
            <Route path="courses/create/quizzes" element={<CreateQuizzes />}/>

            <Route path="*" element={<h1>404 Not Found</h1>} />
         
          </Route>
        </Routes>
  )
}

export default App
