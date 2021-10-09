import {ITodo} from "./model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:4000/";

export const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    tagTypes: ["Todos"],
    endpoints: (builder) => ({
        getAll: builder.query<ITodo[], void>({
            query: () => `todo`, // адрес endpoint
            providesTags: [{type: "Todos", id: "LIST"}],
        }),
        updateTodo: builder.mutation<ITodo, ITodo>({
            query(todo) {
                return {
                    url: `todo/${todo.id}`,
                    method: "PUT",
                    body: todo,
                };
            },
            invalidatesTags: [{ type: "Todos", id: "LIST" }],
        }),
        deleteTodo: builder.mutation<ITodo, ITodo>({
            query(todo) {
                return {
                    url: `todo/${todo.id}`,
                    method: "DELETE",
                    body: todo,
                };
            },
            invalidatesTags: [{ type: "Todos", id: "LIST" }],
        }),
        addTodo: builder.mutation<string, string>({
            query(text) {
                return {
                    url: `todo`,
                    method: "POST",
                    body: {
                        text,
                    },
                };
            },
            invalidatesTags: [{ type: "Todos", id: "LIST" }],
        }),
    }),
});
