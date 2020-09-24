import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Value from "../../../value"

export function resume(schedule: Schedule.Schedule, task: Task.Task): void {
  const upsteam = schedule.chart[task.index]
  for (const upsteam_task of upsteam.values()) {
    // TODO handle name in part.
    if (!Task.finished_p(upsteam_task)) {
      const { value } = Task.current_part(upsteam_task)
      if (value.kind === "Value.grammar") {
        const grammar = value
        if (grammar.name === task.grammar_name) {
          const forward_steps = Task.current_index(task) - task.index
          const resumed_task = {
            ...upsteam_task,
            progress: [
              ...upsteam_task.progress,
              {
                index: Task.current_index(upsteam_task) + forward_steps,
                choice_name: task.choice_name,
              },
            ],
          }
          Schedule.add_task(schedule, resumed_task)
        }
      }
    }
  }
}
