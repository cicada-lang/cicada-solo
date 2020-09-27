import * as Schedule from "../schedule"
import * as Value from "../../value"
import * as ut from "../../../ut"

export function insert_grammar(
  schedule: Schedule.Schedule,
  grammar: Value.Value,
  index: number
): void {
  if (grammar.kind === "Value.grammar") {
    const choices = Value.DelayedChoices.force(grammar.delayed)
    for (const [choice_name, parts] of choices) {
      const task = {
        grammar_name: grammar.name,
        choice_name,
        parts,
        index,
        progress: new Array(),
      }
      Schedule.insert_task(schedule, task)
    }
  } else {
    throw new Error(`expecting Value.grammar but got: ${ut.inspect(grammar)}`)
  }
}
