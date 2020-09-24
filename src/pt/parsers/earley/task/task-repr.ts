import * as Task from "../task"
import * as Value from "../../../value"
import chalk from "chalk"

// NOTE The format of repr:
// <task> = <grammar>:<choice>@<index> -> <part> ...
// <part> = <grammar>:<choice>@<index> | <grammar>@<index>

const POINTER = chalk.bold(chalk.red("» "))

export function repr(task: Task.Task): string {
  let s = task.grammar_name + ":" + task.choice_name + "@" + task.index + " -> "
  for (let i = 0; i < task.parts.length; i++) {
    if (i === task.progress.length) {
      s += POINTER
    }
    s += repr_part(task.parts[i])
    if (i < task.progress.length) {
      s += repr_progress_entry(task.progress[i])
    }
    s += " "
  }
  return s
}

export function repr_progress_entry(entry: { choice_name?: string; index: number }): string {
  const { choice_name, index } = entry
  if (choice_name) {
    return `:${choice_name}@${index}`
  } else {
    return `@${index}`
  }
}

export function repr_part(part: { name?: string; value: Value.Value }): string {
  // TODO use name in part.
  const { name, value } = part
  const present = Value.present(value, { on_grammar: "only_show_name" })
  return present.toString()
}
