import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Value from "../../../value"

export function resume(schedule: Schedule.Schedule, task: Task.Task): void {
  const upsteam = schedule.chart[task.index]
  for (const upsteam_task of upsteam.values()) {
    // TODO handle name in part.
    if (!upsteam_task.finished_p) {
      const { value } = upsteam_task.current_part
      if (value.kind === "Value.grammar") {
        const grammar = value
        if (grammar.name === task.grammar_name) {
          const forward_steps = task.current_index - task.index
          const resumed_task = new Task.Task({
            ...upsteam_task,
            matched_indexes: [
              ...upsteam_task.matched_indexes,
              {
                index: upsteam_task.current_index + forward_steps,
                choice_name: task.choice_name,
              },
            ],
          })
          Schedule.add_task(schedule, resumed_task.id, resumed_task)
        }
      }
    }
  }
}
