import apiClient from '../client.js';

export const createCourse = (courseData) => {
    return apiClient.post('/course', courseData, {headers: {
        'Content-Type': 'multipart/form-data', 
      },});
}

export const getAllCourses = () => {
    return apiClient.get('/course');
}

export const createLesson = (lessonData) => {
   return apiClient.post('/course/lessons', lessonData, {headers: {
        'Content-Type': 'multipart/form-data', 
      },});
}

export const getLessonsByModule = (courseID) => {
   return apiClient.get(`/course/lessons/by-course/${courseID}`);
}

export const getLessonDetails = (lessonId) => {
  return apiClient.get(`/course/lessons/${lessonId}`);
};