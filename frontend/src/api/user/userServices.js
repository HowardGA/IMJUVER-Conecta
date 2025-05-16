import apiClient from "../client.js";

export const findUser = (userID) =>
    apiClient.get(`/user/${userID}`);

export const getAllUsers = () =>
    apiClient.get('/user');
