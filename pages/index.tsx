import { todoController } from "@ui/controller/todo"
import { GlobalStyles } from "@ui/theme/GlobalStyles"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"

// const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";
const bg = "/bg.jpeg" // inside public folder

interface HomeTodo {
  id: string
  content: string
  done: boolean
}

function HomePage() {
  const INITIAL_PAGE = 1

  const initialLoadComplete = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [todos, setTodos] = useState<HomeTodo[]>([])
  const [newTodoContent, setNewTodoContent] = useState<string>("")
  const [search, setSearch] = useState("")

  const hasMorePages = totalPage > page

  const homeTodos = todoController.filterTodosByContent<HomeTodo>(search, todos)

  const hasNoTodos = homeTodos.length === 0 && !isLoading

  useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos)

          setTotalPage(pages)
        })
        .finally(() => {
          setIsLoading(false)
          initialLoadComplete.current = true
        })
    }
  }, [])

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event

    setSearch(value)
  }

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    todoController.create({
      content: newTodoContent,
      onError: (customMessage) => alert(customMessage || "Um erro"),
      onSuccess: (todo: HomeTodo) => {
        setTodos((oldTodos) => [todo, ...oldTodos])

        setNewTodoContent("")
      },
    })
  }

  const toggleDone = (id: string) => {
    setTodos((oldTodos) =>
      oldTodos.map((currentTodo) =>
        currentTodo.id === id
          ? { ...currentTodo, done: !currentTodo.done }
          : currentTodo
      )
    )
  }

  const deleteDone = (id: string) => {
    setTodos((oldTodos) =>
      oldTodos.filter((currentTodo) => currentTodo.id !== id)
    )
  }

  const handleToggleCheckbox = (id: string) => {
    todoController.toggleDone({
      todoId: id,
      updateTodoOnScreen: () => toggleDone(id),
      onError: () => alert("Falha ao atualizar a todo"),
    })
  }

  const newTodoHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoContent(event.target.value)
  }

  const handleDeleteTodo = (id: string) => {
    todoController.deleteById({
      todoId: id,
      updateTodoOnScreen: () => deleteDone(id),
      onError: () => alert("Falha ao atualizar a todo"),
    })
  }

  return (
    <main>
      <GlobalStyles themeName="devsoutinho" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form onSubmit={handleSubmitForm}>
          <input
            value={newTodoContent}
            type="text"
            placeholder="Correr, Estudar..."
            onChange={newTodoHandler}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            value={search}
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={handleSearch}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {homeTodos.map((todo) => (
              <tr key={todo.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggleCheckbox(todo.id)}
                  />
                </td>

                <td>
                  {todo.done ? (
                    <s>{todo.id.substring(0, 4)}</s>
                  ) : (
                    todo.id.substring(0, 4)
                  )}
                </td>
                <td>{todo.done ? <s>{todo.content}</s> : todo.content}</td>

                <td align="right">
                  <button
                    data-type="delete"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      const nextPage = page + 1
                      setIsLoading(true)
                      setPage(nextPage)

                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => [...oldTodos, ...todos])

                          setTotalPage(pages)
                        })
                        .finally(() => {
                          setIsLoading(false)
                        })
                    }}
                  >
                    Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default HomePage
