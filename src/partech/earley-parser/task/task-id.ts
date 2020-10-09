import * as Task from "../task"

export function id(task: Task.Task): string {
  return task.id_head + task.id_body
}
