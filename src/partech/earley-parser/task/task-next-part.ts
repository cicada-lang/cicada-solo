import * as Task from "../task"
import * as Value from "../../value"

export function next_part(
  task: Task.Task
): { name?: string; value: Value.Value } {
  if (Task.finished_p(task)) {
    throw new Error(
      `finished task have no next part.\n` +
        `progress.length: ${task.progress.length}\n`
    )
  }

  return task.parts[task.progress.length]
}
