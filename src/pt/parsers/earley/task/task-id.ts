import * as Task from "../task"
import * as Value from "../../../value"

export function id(task: Task.Task): string {
  let s = task.grammar_name + ":" + task.choice_name + "@" + task.index
  for (let i = 0; i < task.progress.length; i++) {
    const { index, choice_name } = task.progress[i]
    if (choice_name) {
      s += `(${index}:${choice_name})`
    } else {
      s += `(${index})`
    }
  }
  return s
}
