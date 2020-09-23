import * as Machine from "../machine"
import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Token from "../../../token"
import * as Value from "../../../value"

export function continue_upstream_tasks(
  machine: Machine.Machine,
  task: Task.Task
): void {
  const upsteam = machine.schedule.chart[task.index]
  for (const upsteam_task of upsteam.values()) {
    // TODO handle name in part.
    const { value } = upsteam_task.current_part
    if (value.kind === "Value.grammar") {
      const grammar = value
      if (grammar.name === task.grammar_name) {
        // TODO handle DelayedChoices
        // Schedule.add_task(
        //   machine.schedule,
        //   Task.matched_non_terminal(
        //     upsteam_task,
        //     Task.length(task),
        //     task.choice_name
        //   )
        // )
      }
    }
  }
}

// export function matched_terminal(task: Task.Task): Task.Task {
//   return new Task.Task(task.rule, task.choice_name, task.start, [
//     ...task.matches,
//     new Matched.Terminal(task.current + 1),
//   ])
// }

// export function matched_non_terminal(
//   task: Task.Task,
//   n: number,
//   choice_name: string
// ): Task.Task {
//   return new Task.Task(task.rule, task.choice_name, task.start, [
//     ...task.matches,
//     new Matched.NonTerminal(task.current + n, choice_name),
//   ])
// }
