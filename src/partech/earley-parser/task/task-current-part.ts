import * as Task from "../task"
import * as Value from "../../value"

export function current_part(
  task: Task.Task
): { name?: string; value: Value.Value } {
  const part = task.parts[task.progress.length]
  if (part !== undefined) {
    return part
  } else {
    throw new Error(
      `current_part is undefined.\n` +
        `progress.length: ${task.progress.length}\n`
    )
  }
}
