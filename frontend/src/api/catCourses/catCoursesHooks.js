import { useMutation, useQuery } from "@tanstack/react-query";
import {
    createCategory,
    getAllCategories
} from "./catCourseServices.js";

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: (categoryData) => createCategory(categoryData),
        onSuccess: (data) => {
            console.log("Category created successfully:", data);
        },
        onError: (error) => {
            console.error("Error creating category:", error);
        },
    });
}

export const useGetAllCategories = () => {
    return useQuery({
        queryKey: ["categories"], 
        queryFn: () => getAllCategories(), 
        onSuccess: (data) => {
            console.log("Categories fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching categories:", error);
        },
    });
};