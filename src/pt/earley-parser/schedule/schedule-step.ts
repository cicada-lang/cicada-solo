import * as Schedule from "../schedule"
import * as Task from "../task"

export function step(schedule: Schedule.Schedule, task: Task.Task): void {
  const { value } = Task.current_part(task)
  switch (value.kind) {
    case "Value.fn": {
      throw new Error(`step should not meet Value.fn`)
    }
    case "Value.str": {
      return match_str(schedule, task, value.value)
    }
    case "Value.pattern": {
      return match_pattern(schedule, task, value.label, value.value)
    }
    case "Value.grammar": {
      return Schedule.insert_grammar(schedule, value, Task.current_index(task))
    }
  }
}

function match_str(
  schedule: Schedule.Schedule,
  task: Task.Task,
  str: string
): void {
  if (Task.current_index(task) < schedule.tokens.length) {
    const token = schedule.tokens[Task.current_index(task)]
    if (str === token.value) {
      const entry = { index: Task.current_index(task) + 1 }
      const progress = [...task.progress, entry]
      Schedule.insert_task(schedule, { ...task, progress })
    }
  }
}

function match_pattern(
  schedule: Schedule.Schedule,
  task: Task.Task,
  label: string,
  pattern: RegExp
): void {
  if (Task.current_index(task) < schedule.tokens.length) {
    const token = schedule.tokens[Task.current_index(task)]
    if (label === token.label && pattern.exec(token.value)) {
      const entry = { index: Task.current_index(task) + 1 }
      const progress = [...task.progress, entry]
      Schedule.insert_task(schedule, { ...task, progress })
    }
  }
}
