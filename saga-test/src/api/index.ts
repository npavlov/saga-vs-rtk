import {ITodo} from "./model";

const BASE_URL = 'http://localhost:4000/todo';

export const getTodos = async (): Promise<ITodo[]> =>
    fetch(BASE_URL).then(res => res.json())

export const createTodo = async (text: string): Promise<ITodo> =>
    fetch(BASE_URL,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text}),
        }).then(res => res.json());

export const updateTodo = async (todo: ITodo): Promise<ITodo> =>
    fetch(`${BASE_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    }).then((res) => res.json());

export const deleteTodo = async (todo: ITodo): Promise<ITodo> =>
    fetch(`${BASE_URL}/${todo.id}`, {
        method: "DELETE",
    }).then(() => todo);
