import { Todo } from "@ui/schema/todo";

interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

export type { TodoRepositoryGetOutput, TodoRepositoryGetParams };
