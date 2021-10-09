import React, {useCallback, useRef} from 'react';

import {ITodo} from "./api/model";
import {QueryClientProvider, useMutation, useQuery} from "react-query";
import {axiosClient, queryClient} from "./api/client";

function TodoApp() {
    const {isLoading, data} = useQuery('todos', async () => {
        const {data} = await axiosClient.get<ITodo[]>('/todo');
        return data;
    })

    const invalidateTodos = () => {
        queryClient.invalidateQueries('todos');
    };

    const createMutation = useMutation<Response, unknown, {text:string}>(newTodo => {
        return axiosClient.post('/todo', newTodo)
    }, {
        onSettled: invalidateTodos
    })

    const deleteMutation = useMutation<Response, unknown, ITodo>(todo => {
        return axiosClient.delete(`/todo/${todo.id}`)
    }, {
        onSettled: invalidateTodos
    })

    const toggleMutation = useMutation<Response, unknown, ITodo>(todo => {
        return axiosClient.put(`/todo/${todo.id}`, {...todo, done: !todo.done})
    }, {
        onSettled: invalidateTodos
    })

    const textRef = useRef<HTMLInputElement>(null);
    const onAdd = useCallback(
        () => {
            createMutation.mutate({text: textRef.current!.value ?? ""})
            textRef.current!.value = "";
        },
        [createMutation]
    );

    return (
        <div className="App">
            <div className="todos">
                {isLoading && 'Loading...'}
                {data?.map((todo) => (
                    <React.Fragment key={todo.id}>
                        <div>
                            <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={() => toggleMutation.mutate(todo)}
                            />
                            <span>{todo.text}</span>
                        </div>
                        <button onClick={() => deleteMutation.mutate(todo)}>Delete</button>
                    </React.Fragment>
                ))}
            </div>
            <div className="add">
                <input type="text" ref={textRef}/>
                <button onClick={onAdd}>Add</button>
            </div>
        </div>
    );
}

function App() {
    return <QueryClientProvider client={queryClient}>
        <TodoApp/>
    </QueryClientProvider>
}

export default App;
