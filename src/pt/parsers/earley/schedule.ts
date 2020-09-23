import * as Task from "./task"
import * as Value from "../../value"
import * as Token from "../../token"
import * as ut from "../../../ut"

export class Schedule {
  constructor(
    public queue: Array<Task.Task>,
    public chart: Array<Map<string, Task.Task>>
  ) {}
}

export function add_task(
  schedule: Schedule,
  task_id: string,
  task: Task.Task
): void {
  if (!schedule.chart[task.current_index].has(task_id)) {
    schedule.chart[task.current_index].set(task_id, task)
    schedule.queue.push(task)
  }
}

export function add_grammar(
  schedule: Schedule,
  grammar: Value.Value,
  index: number
): void {
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
      add_task(schedule, task.id, task)
    }
  } else {
    throw new Error(`expecting Value.grammar but got: ${ut.inspect(grammar)}`)
  }
}

export function init(
  tokens: Array<Token.Token>,
  grammar: Value.Value
): Schedule {
  const queue = new Array()
  // NOTE chart.length === tokens.length + 1
  const chart = new Array()
  for (let i = 0; i < tokens.length + 1; i++) {
    chart.push(new Map())
  }
  const schedule = new Schedule(queue, chart)
  add_grammar(schedule, grammar, 0)
  return schedule
}
