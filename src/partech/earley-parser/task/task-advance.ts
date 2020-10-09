import * as Task from "../task"
import * as Value from "../../value"

export function advance(
  task: Task.Task,
  entry: { index: number; choice_name?: string }
): Task.Task {
  return {
    grammar_name: task.grammar_name,
    choice_name: task.choice_name,
    parts: task.parts,
    index: task.index,
    progress: [...task.progress, entry],
    id_head: task.id_head,
    id_body: task.id_body + format_entry(entry),
  }
}

function format_entry(entry: { index: number; choice_name?: string }): string {
  const { choice_name, index } = entry
  if (choice_name) {
    return `(:${choice_name}@${index})`
  } else {
    return `(@${index})`
  }
}
