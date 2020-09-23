import * as Machine from "../machine"
import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Token from "../../../token"
import * as Value from "../../../value"

export function step(machine: Machine.Machine, task: Task.Task): void {
  // TODO handle name in part
  const { value } = task.current_part

  switch (value.kind) {
    case "Value.fn": {
      throw new Error(`step should not meet Value.fn`)
    }
    case "Value.str": {
      if (task.current_index < machine.tokens.length) {
        const token = machine.tokens[task.current_index]
        if (value.value === token.value) {
          const new_task = new Task.Task({
            ...task,
            matched_indexes: [
              ...task.matched_indexes,
              { index: task.current_index + 1 },
            ],
          })
          Schedule.add_task(machine.schedule, new_task.id, new_task)
        }
      }
      break
    }
    case "Value.pattern": {
      if (task.current_index < machine.tokens.length) {
        const token = machine.tokens[task.current_index]
        if (value.label === token.label && value.value.exec(token.value)) {
          const new_task = new Task.Task({
            ...task,
            matched_indexes: [
              ...task.matched_indexes,
              { index: task.current_index + 1 },
            ],
          })
          Schedule.add_task(machine.schedule, new_task.id, new_task)
        }
      }
      break
    }
    case "Value.grammar": {
      Schedule.add_grammar(machine.schedule, value, task.current_index)
      break
    }
  }
}
