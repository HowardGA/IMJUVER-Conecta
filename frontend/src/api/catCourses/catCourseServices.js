import apiClient from '../client.js';

export const getAllCategories = () => {
    return apiClient.get('/courseCategory');
}

export const createCategory = (categoryData) => {
    return apiClient.post('/courseCategory', categoryData);
}