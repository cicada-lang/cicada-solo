import * as Schedule from "../schedule"
import * as TaskQueue from "../task-queue"
import * as FinishedChart from "../finished-chart"
import * as Task from "../task"

export type Opts = {
  task?: { verbose?: boolean }
  schedule?: { verbose?: boolean }
}

export const DEFAULT_OPTS = {
  task: { verbose: false },
  schedule: { verbose: false },
}

export function run(
  schedule: Schedule.Schedule,
  opts: Opts = DEFAULT_OPTS
): void {
  while (true) {
    if (opts.schedule?.verbose) {
      console.log(Schedule.repr(schedule))
    }

    const task = TaskQueue.dequeue(schedule.queue)

    if (task === undefined) return

    if (opts.task?.verbose) {
      console.log(
        Task.finished_p(task) ? "[resume from]:" : "   [stepping]:",
        Task.repr(task)
      )
    }

    if (Task.finished_p(task)) {
      Schedule.resume(schedule, task)
      FinishedChart.insert(schedule.finished_chart, task)
    } else {
      Schedule.step(schedule, task)
      Schedule.leap(schedule, task)
    }
  }
}
