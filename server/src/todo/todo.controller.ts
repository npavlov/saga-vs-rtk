import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ITodo } from './model';

let todos: ITodo[] = [
  'Gitlab CI',
  'Docker',
  'K8s',
  'HelmChart',
  'ArgoCD',
  'React Query',
  'Effector',
  'Electron',
].map((text, index) => ({
  id: index + 1,
  text: `Learn ${text}`,
  active: true,
  done: false,
}));

@Controller('todo')
export class TodoController {
  @Get()
  async index() {
    return todos.filter(({ active }) => active);
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<ITodo> {
    return todos.find((todo) => todo.id === parseInt(id));
  }

  @Post()
  async create(@Body() { text }: { text: string }): Promise<ITodo> {
    const todo = {
      id: todos.length + 1,
      text,
      active: true,
      done: false,
    };
    todos.push(todo);
    return todo;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: ITodo): Promise<ITodo> {
    todos = todos.map((todo) =>
      todo.id === parseInt(id) ? { ...todo, ...data } : todo,
    );

    return data;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<number> {
    todos = todos.map((todo) =>
      todo.id === parseInt(id) ? { ...todo, active: false } : todo,
    );
    return parseInt(id);
  }
}
