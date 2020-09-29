import * as TaskQueue from "../task-queue"
import * as Task from "../task"

export function dequeue(queue: TaskQueue.TaskQueue): undefined | Task.Task {
  return queue.shift()
}
