import { HttpNotFoundError } from "@server/infra/errors"
import { create, deleteById as dbDeleteById, read, update } from "core/crud"

interface TodoRepositoryGetParams {
  page?: number
  limit?: number
}

interface Todo {
  id: string
  date: string
  content: string
  done: boolean
}

interface TodoRepositoryGetOutput {
  todos: Todo[]
  total: number
  pages: number
}

const get = ({
  page,
  limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput => {
  const INITIAL_PAGE = 1
  const INITIAL_LIMIT = 10

  const currentPage = page || INITIAL_PAGE
  const currentLimit = limit || INITIAL_LIMIT

  const ALL_TODOS = read().reverse()

  const startIndex = (currentPage - 1) * currentLimit
  const endIndex = currentPage * currentLimit
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex)
  const totalPages = Math.ceil(ALL_TODOS.length / currentLimit)

  return {
    total: ALL_TODOS.length,
    pages: totalPages,
    todos: paginatedTodos,
  }
}

const createByContent = async (content: string): Promise<Todo> => {
  const newTodo = create(content)

  return newTodo
}

const toggleDone = async (id: string): Promise<Todo> => {
  const ALL_TODOS = read()

  const todo = ALL_TODOS.find((todo) => todo.id === id)

  if (!todo) throw new Error(`Todo with id "${id}" not found`)

  const updatedTodo = update(todo.id, {
    done: !todo.done,
  })

  return updatedTodo
}

const deleteById = async (id: string) => {
  const ALL_TODOS = read()

  const todo = ALL_TODOS.find((todo) => todo.id === id)

  if (!todo) throw new HttpNotFoundError(`Todo with id "${id}" not found`)

  dbDeleteById(id)
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
}
