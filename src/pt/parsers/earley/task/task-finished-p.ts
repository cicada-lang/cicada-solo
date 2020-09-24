import * as Task from "../task"

export function finished_p(task: Task.Task): boolean {
  return task.progress.length === task.parts.length
}
