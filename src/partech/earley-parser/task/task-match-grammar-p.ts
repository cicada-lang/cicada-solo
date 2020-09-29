import * as Task from "../task"
import * as Value from "../../value"

export function match_grammar_p(
  task: Task.Task,
  grammar: Value.grammar
): boolean {
  if (task.grammar_name !== grammar.name) return false
  const { delayed } = grammar
  if (!delayed.choices.has(task.choice_name)) return false
  const choices = Value.DelayedChoices.force(delayed)
  const parts = choices.get(task.choice_name)
  if (parts === undefined) return false
  return Value.equal_parts(parts, task.parts)
}
