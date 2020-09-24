import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Token from "../../../token"
import * as Value from "../../../value"

export function step(schedule: Schedule.Schedule, task: Task.Task): void {
  // TODO handle name in part
  const { value } = Task.current_part(task)

  switch (value.kind) {
    case "Value.fn": {
      throw new Error(`step should not meet Value.fn`)
    }
    case "Value.str": {
      if (Task.current_index(task) < schedule.tokens.length) {
        const token = schedule.tokens[Task.current_index(task)]
        if (value.value === token.value) {
          const new_task = {
            ...task,
            progress: [
              ...task.progress,
              { index: Task.current_index(task) + 1 },
            ],
          }
          Schedule.add_task(schedule, new_task)
        }
      }
      break
    }
    case "Value.pattern": {
      if (Task.current_index(task) < schedule.tokens.length) {
        const token = schedule.tokens[Task.current_index(task)]
        if (value.label === token.label && value.value.exec(token.value)) {
          const new_task = {
            ...task,
            progress: [
              ...task.progress,
              { index: Task.current_index(task) + 1 },
            ],
          }
          Schedule.add_task(schedule, new_task)
        }
      }
      break
    }
    case "Value.grammar": {
      Schedule.add_grammar(schedule, value, Task.current_index(task))
      break
    }
  }
}
