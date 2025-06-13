import { useMutation, useQuery } from "@tanstack/react-query";
import {createCourse, getAllCourses, createLesson, getLessonsByModule, getLessonDetails} from './coursesServices.js';

export const useCreateCourse = () => {
    return useMutation({
        mutationFn: (courseData) => createCourse(courseData),
        onSuccess: (data) => {
            console.log('Course created successfully:', data);
        },
        onError: (error) => {
            console.error('Error creating course:', error);
        }
    })
}

export const useGetCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: () => getAllCourses(),
        onSuccess: (data) => {
            console.log('Courses fetched successfully:', data);
        },
        onError: (error) => {
            console.error('Error fetching courses:', error);
        }
    })
}

export const useCreateLesson = () => {
    return useMutation({
        mutationFn: (lessonData) => createLesson(lessonData)
    })
}

export const useGetLessonsbyModule = (courseID) => {
    return useQuery({
        queryKey: ['lessons'],
        queryFn: () => getLessonsByModule(courseID)
    })
}

export const useGetLessonDetails = (lessonId) => {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLessonDetails(lessonId),
    enabled: !!lessonId
  });
};