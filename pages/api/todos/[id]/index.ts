import { todoController } from "@server/controller/todo"
import { NextApiRequest, NextApiResponse } from "next"

const handler = (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "DELETE") {
    todoController.deleteById(request, response)
    return
  }

  response.status(405).json({
    error: {
      message: "Method not allowed",
    },
  })
}

export default handler
