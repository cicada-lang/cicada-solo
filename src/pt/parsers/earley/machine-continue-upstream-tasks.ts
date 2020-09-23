import * as Machine from "./machine"
import * as Schedule from "./schedule"
import * as Task from "./task"
import * as Token from "../../token"
import * as Value from "../../value"

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
