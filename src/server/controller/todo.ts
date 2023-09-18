import { NextApiRequest, NextApiResponse } from "next"
import { z as schema } from "zod"

import { HttpNotFoundError } from "@server/infra/errors"
import { todoRepository } from "../repository/todo"

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query
  const page = Number(query.page)
  const limit = Number(query.limit)

  if (query.page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: "`page` must to be a number",
      },
    })

    return
  }

  if (query.limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "`limit` must to be a number",
      },
    })

    return
  }

  const output = todoRepository.get({ page, limit })

  res.status(200).json(output)
}

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const TodoCreateBodySchema = schema.object({
    content: schema.string(),
  })

  const body = TodoCreateBodySchema.safeParse(req.body)

  if (!body.success) {
    res.status(400).json({
      error: {
        message: "You missed to provide a content to create a todo",
        description: body.error.issues,
      },
    })

    return
  }

  const createdTodo = await todoRepository.createByContent(body.data.content)
  res.status(201).json({ todo: createdTodo })
}

const toggleDone = async (req: NextApiRequest, res: NextApiResponse) => {
  const todoId = req.query.id

  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: "You must to provide a string ID",
    })

    return
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(todoId)

    res.status(200).json({
      todo: updatedTodo,
    })
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({
        error: err.message,
      })
    }
  }
}

const deleteById = async (req: NextApiRequest, res: NextApiResponse) => {
  const QuerySchema = schema.object({
    id: schema.string().uuid().nonempty(),
  })

  const parsedQuery = QuerySchema.safeParse(req.query)

  if (!parsedQuery.success) {
    res.status(400).json({
      error: "You must to provide a valid ID",
    })

    return
  }
  const todoId = parsedQuery.data.id

  try {
    await todoRepository.deleteById(todoId)
    res.status(204).end()
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      res.status(err.status).json({
        error: `Failed to delete resource with id ${todoId}`,
      })
    }

    res.status(500).json({
      error: `Internal server error`,
    })
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
}
