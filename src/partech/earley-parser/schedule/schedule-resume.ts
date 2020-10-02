import * as Value from "../../value"
import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function resume(schedule: Schedule.Schedule, task: Task.Task): void {
  for (const entry of TaskChart.resumable_entries(schedule.chart, task)) {
    const { task: upsteam_task, grammar } = entry
    if (Task.match_grammar_p(task, grammar)) {
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
      Schedule.insert_task(schedule, resumed_task)
    }
  }
}
