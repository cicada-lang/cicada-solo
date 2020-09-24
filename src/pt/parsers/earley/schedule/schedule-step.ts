import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Token from "../../../token"
import * as Value from "../../../value"

export function step(schedule: Schedule.Schedule, task: Task.Task): void {
  // TODO handle name in part
  const { value } = task.current_part

  switch (value.kind) {
    case "Value.fn": {
      throw new Error(`step should not meet Value.fn`)
    }
    case "Value.str": {
      if (task.current_index < schedule.tokens.length) {
        const token = schedule.tokens[task.current_index]
        if (value.value === token.value) {
          const new_task = new Task.Task({
            ...task,
            matched_indexes: [
              ...task.matched_indexes,
              { index: task.current_index + 1 },
            ],
          })
          Schedule.add_task(schedule, new_task.id, new_task)
        }
      }
      break
    }
    case "Value.pattern": {
      if (task.current_index < schedule.tokens.length) {
        const token = schedule.tokens[task.current_index]
        if (value.label === token.label && value.value.exec(token.value)) {
          const new_task = new Task.Task({
            ...task,
            matched_indexes: [
              ...task.matched_indexes,
              { index: task.current_index + 1 },
            ],
          })
          Schedule.add_task(schedule, new_task.id, new_task)
        }
      }
      break
    }
    case "Value.grammar": {
      Schedule.add_grammar(schedule, value, task.current_index)
      break
    }
  }
}
