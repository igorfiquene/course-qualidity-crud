import { todoRepository } from "@ui/repository/todo"
import { Todo } from "@ui/schema/todo"
import { z as schema } from "zod"

interface TodoControllerGetParams {
  page: number
}

const get = async ({ page }: TodoControllerGetParams) => {
  const limit = 2

  return todoRepository.get({
    page: page,
    limit,
  })
}

const filterTodosByContent = <Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Todo[] => {
  const homeTodos = todos.filter((todo) =>
    todo.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )

  return homeTodos
}

interface TodoControllerCreateParams {
  content?: string
  onError: (message?: string) => void
  onSuccess: (todo: Todo) => void
}

interface TodoControllerToggleDoneParams {
  todoId: string
  updateTodoOnScreen: () => void
  onError: () => void
}

const create = ({
  content,
  onError,
  onSuccess,
}: TodoControllerCreateParams) => {
  const parsedParams = schema.string().nonempty().safeParse(content)

  if (!parsedParams.success) {
    onError("Você precisa prover um conteúdo!")
    return
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((todo) => {
      onSuccess(todo)
    })
    .catch(() => {
      onError("Um erro diferente")
    })
}

const toggleDone = ({
  todoId,
  updateTodoOnScreen,
  onError,
}: TodoControllerToggleDoneParams) => {
  updateTodoOnScreen()

  todoRepository
    .toggleDone(todoId)
    .then()
    .catch(() => onError())

  // Update Real, not Optmistic Update
  // todoRepository.toggleDone(todoId).then(() => {
  //   setTimeout(() => {
  //     updateTodoOnScreen()
  //   }, 1000)
  // })
}

const deleteById = async ({
  todoId,
  updateTodoOnScreen,
  onError,
}: TodoControllerToggleDoneParams): Promise<void> => {
  await todoRepository
    .deleteById(todoId)
    .then(() => updateTodoOnScreen())
    .catch(() => onError())
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
  filterTodosByContent,
}
