import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as ResumableChart from "../resumable-chart"
import * as Task from "../task"

export function resume(schedule: Schedule.Schedule, task: Task.Task): void {
  for (const entry of ResumableChart.entries(schedule.resumable_chart, task)) {
    if (Task.match_grammar_p(task, entry.grammar)) {
      const forward_steps = Task.progress_index(task) - task.index
      Schedule.insert_task(
        schedule,
        Task.advance(entry.task, {
          index: Task.progress_index(entry.task) + forward_steps,
          choice_name: task.choice_name,
        })
      )
    }
  }
}
