import * as Task from "../task"
import * as Value from "../../../value"

export function match_grammar_p(
  task: Task.Task,
  grammar: Value.grammar
): boolean {
  // TODO
  return task.grammar_name === grammar.name
}
