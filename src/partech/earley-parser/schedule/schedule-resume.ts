import * as Value from "../../value"
import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function resume(schedule: Schedule.Schedule, task: Task.Task): void {
  for (const upsteam_task of TaskChart.upsteam_tasks(schedule.chart, task)) {
    const { value } = Task.current_part(upsteam_task)
    // TODO also save grammar in indexing -- to avoid type casting
    const grammar = value as Value.grammar
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
