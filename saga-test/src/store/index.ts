import {createStore, applyMiddleware} from "redux";
import {ITodo} from "../api/model";
import {createTodo, deleteTodo, getTodos, updateTodo} from "../api";
import {put, takeEvery} from 'redux-saga/effects';
import createSagaMiddleware from "redux-saga";

const fetch_succeeded = "TODO_FETCH_SUCCEEDED";
export const fetch_requested = "TODO_FETCH_REQUESTED";
const update_requested = "TODO_UPDATE_REQUESTED";
const delete_requested = "TODO_DELETE_REQUESTED";
const create_requested = "CREATE_TODO_REQUESTED";

function* getTodosAction() {
    const todos: ITodo[] = yield getTodos();
    yield put({type: fetch_succeeded, payload: todos})
}

function* updateTodoAction({payload}: { type: typeof update_requested, payload: ITodo }) {
    yield updateTodo(payload);
    yield put({type: fetch_requested})
}

function* deleteTodoAction({payload}: { type: typeof delete_requested, payload: ITodo }) {
    yield deleteTodo(payload);
    yield put({type: fetch_requested})
}

function* createTodoAction({payload}: { type: typeof create_requested; payload: string }) {
    yield createTodo(payload);
    yield put({type: fetch_requested});
}


function* rootSaga() {
    yield takeEvery(fetch_requested, getTodosAction);
    yield takeEvery(update_requested, updateTodoAction);
    yield takeEvery(delete_requested, deleteTodoAction);
    yield takeEvery(create_requested, createTodoAction);
}

const reducer = (state: ITodo[] = [], action: { type: typeof fetch_succeeded, payload: ITodo[] }) => {
    switch (action.type) {
        case fetch_succeeded:
            return action.payload;
        default:
            return state;
    }
}
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export const fetchedTodos = (state: ITodo[]) => state;

export const fetchTodos = () => ({type: fetch_requested});

export const toggleTodo = (todo: ITodo) => ({
    type: update_requested,
    payload: {...todo, done: !todo.done}
});

export const removeTodo = (todo: ITodo) => ({
    type: delete_requested,
    payload: todo
});

export const addTodo = (text: string) => ({
    type: create_requested,
    payload: text,
});
