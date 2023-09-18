import { NextApiRequest, NextApiResponse } from "next"
import { todoController } from "src/server/controller/todo"

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "PUT") {
    todoController.toggleDone(request, response)
    return
  }

  response.status(405).json({
    error: {
      message: "Method not allowed",
    },
  })
}
