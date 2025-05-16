import { useMutation } from "@tanstack/react-query";
import {
    findUser,
    getAllUsers
} from './userServices.js';

export const useFindUser = () => {
    return useMutation({
        mutationFn: (userID) => findUser(userID)
    })
}

export const useGetAllUsers = () => {
    return useMutation({
        mutationFn: () => getAllUsers()
    })
}