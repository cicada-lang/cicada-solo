import * as Task from "../task"

export function current_index(task: Task.Task): number {
  if (task.progress.length === 0) {
    return task.index
  } else {
    const last_matched = task.progress[task.progress.length - 1]
    return last_matched.index
  }
}
