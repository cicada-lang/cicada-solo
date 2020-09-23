import * as Task from "./task"
import * as Value from "../../value"
import * as ut from "../../../ut"

export class Schedule {
  constructor(
    public queue: Array<Task.Task>,
    public chart: Array<Map<string, Task.Task>>
  ) {}

  add_task(task_id: string, task: Task.Task): void {
    if (!this.chart[task.current_index].has(task_id)) {
      this.chart[task.current_index].set(task_id, task)
      this.queue.push(task)
    }
  }

  add_grammar(grammar: Value.Value, index: number): void {
    if (grammar.kind === "Value.grammar") {
      const choices = Value.DelayedChoices.force(grammar.delayed)
      for (const [choice_name, parts] of choices) {
        const task = new Task.Task({
          grammar_name: grammar.name,
          choice_name,
          parts,
          index,
          matched_indexes: Array.of(),
        })
        this.add_task(task.id, task)
      }
    } else {
      throw new Error(`expecting Value.grammar but got: ${ut.inspect(grammar)}`)
    }
  }
}
