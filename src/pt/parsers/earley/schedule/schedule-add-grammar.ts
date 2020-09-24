import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Value from "../../../value"
import * as ut from "../../../../ut"

export function add_grammar(
  schedule: Schedule.Schedule,
  grammar: Value.Value,
  index: number
): void {
  if (grammar.kind === "Value.grammar") {
    const choices = Value.DelayedChoices.force(grammar.delayed)
    for (const [choice_name, parts] of choices) {
      const task = new Task.Task({
        grammar_name: grammar.name,
        choice_name,
        parts,
        index,
        progress: new Array(),
      })
      Schedule.add_task(schedule, Task.id(task), task)
    }
  } else {
    throw new Error(`expecting Value.grammar but got: ${ut.inspect(grammar)}`)
  }
}
