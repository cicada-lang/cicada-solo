import * as Schedule from "../schedule"
import * as TaskQueue from "../task-queue"
import * as TaskChart from "../task-chart"
import * as Task from "../task"

export function add_task(schedule: Schedule.Schedule, task: Task.Task): void {
  const index = Task.current_index(task)
  TaskChart.insert(schedule.chart, index, task, {
    on_new_task: (task) => TaskQueue.enqueue(schedule.queue, task),
  })
}
