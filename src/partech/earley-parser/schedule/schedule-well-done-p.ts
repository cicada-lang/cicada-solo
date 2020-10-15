import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function well_done_p(schedule: Schedule.Schedule): boolean {
  const ending_task_p = (task: Task.Task): boolean =>
    Task.match_grammar_p(task, schedule.grammar) &&
    Task.progress_index(task) === schedule.tokens.length
  return Array.from(TaskChart.tasks_at_end(schedule.chart)).some(ending_task_p)
}
