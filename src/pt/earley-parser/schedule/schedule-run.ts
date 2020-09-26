import * as Schedule from "../schedule"
import * as Task from "../task"

export interface Opts {
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

    // NOTE About searching.
    // push & shift -- Breadth-first search
    // push & pop   --   Depth-first search
    const task = schedule.queue.shift()
    if (task === undefined) {
      return
    } else if (Task.finished_p(task)) {
      if (opts.task?.verbose) {
        console.log("[resume from]:", Task.repr(task))
      }
      Schedule.resume(schedule, task)
    } else {
      if (opts.task?.verbose) {
        console.log("   [stepping]:", Task.repr(task))
      }
      Schedule.step(schedule, task)
    }
  }
}
