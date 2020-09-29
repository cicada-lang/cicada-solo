import * as TaskQueue from "../task-queue"
import * as Task from "../task"

export function enqueue(queue: TaskQueue.TaskQueue, task: Task.Task): void {
  queue.push(task)
}
