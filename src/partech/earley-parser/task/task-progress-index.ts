import * as Task from "../task"

export function progress_index(task: Task.Task): number {
  if (task.progress.length === 0) {
    return task.index
  } else {
    const last_prograss_entry = task.progress[task.progress.length - 1]
    return last_prograss_entry.index
  }
}
