import * as Schedule from "../schedule"
import { ParsingError } from "../../errors"
import * as Value from "../../value"
import * as Task from "../task"
import * as ut from "../../../ut"

export function step(schedule: Schedule.Schedule, task: Task.Task): void {
  const { value } = Task.next_part(task)
  switch (value.kind) {
    case "Value.fn": {
      const index = Task.progress_index(task)
      const token = schedule.tokens[index]
      const span = token.span
      throw new ParsingError(
        "Schedule.step should not meet Value.fn\n" +
          `value: ${ut.inspect(Value.present(value))}`,
        { span }
      )
    }
    case "Value.str":
    case "Value.pattern": {
      return match_terminal(schedule, task, value)
    }
    case "Value.grammar": {
      return Schedule.insert_grammar(schedule, value, Task.progress_index(task))
    }
  }
}

function match_terminal(
  schedule: Schedule.Schedule,
  task: Task.Task,
  value: Value.Value
): void {
  if (Task.progress_index(task) < schedule.tokens.length) {
    const token = schedule.tokens[Task.progress_index(task)]
    if (Value.terminal_match(value, token)) {
      const entry = { index: Task.progress_index(task) + 1 }
      const progress = [...task.progress, entry]
      Schedule.insert_task(schedule, { ...task, progress })
    }
  }
}
