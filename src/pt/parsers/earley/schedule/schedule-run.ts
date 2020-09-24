import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Token from "../../../token"
import * as Value from "../../../value"

export function run(schedule: Schedule.Schedule) : void {
  while (true) {
    // NOTE About searching.
    // push & shift -- Breadth-first search
    // push & pop   --   Depth-first search
    const task = schedule.queue.shift()
    if (task === undefined) {
      return
    } else if (task.finished_p) {
      // console.log("[resume from]:", Task.repr(task))
      Schedule.resume(schedule, task)
    } else {
      // console.log("   [stepping]:", Task.repr(task))
      Schedule.step(schedule, task)
    }
  }
}
