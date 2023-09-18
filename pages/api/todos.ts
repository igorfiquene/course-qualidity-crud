import { NextApiRequest, NextApiResponse } from "next"
import { todoController } from "src/server/controller/todo"

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    todoController.get(request, response)
    return
  }

  if (request.method === "POST") {
    todoController.create(request, response)
    return
  }

  response.status(405).json({
    error: {
      message: "Method not allowed",
    },
  })
}
