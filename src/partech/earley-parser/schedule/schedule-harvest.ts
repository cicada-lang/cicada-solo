import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as Task from "../task"
import { ParsingError } from "../../errors"
import * as Value from "../../value"
import * as Token from "../../token"
import * as Tree from "../../tree"
import * as Span from "../../span"
import { Obj } from "../../../ut"
import * as ut from "../../../ut"

export function harvest(schedule: Schedule.Schedule): Tree.Tree {
  const start = 0
  const end = TaskChart.length(schedule.chart) - 1
  return harvest_node(schedule, schedule.grammar, start, end)
}

function harvest_node(
  schedule: Schedule.Schedule,
  grammar: Value.grammar,
  start: number,
  end: number
): Tree.node {
  for (const task of TaskChart.tasks_at(schedule.chart, end)) {
    if (task_ripe_p(task)) {
      return Tree.node(
        { name: grammar.name, kind: task.choice_name },
        harvest_body(
          schedule,
          get_parts(grammar, task.choice_name),
          task.progress,
          start
        ),
        span_from_tokens(schedule.tokens, start, end)
      )
    }
  }

  throw Schedule.parsing_error(schedule, grammar, start, end)

  function task_ripe_p(task: Task.Task): boolean {
    return (
      start === task.index &&
      end === Task.progress_index(task) &&
      task.progress.length === task.parts.length &&
      Task.match_grammar_p(task, grammar)
    )
  }

  function get_parts(
    grammar: Value.grammar,
    choice_name: string
  ): Array<{ name?: string; value: Value.Value }> {
    const choices = Value.DelayedChoices.force(grammar.delayed)
    const parts = choices.get(choice_name)
    if (parts === undefined) {
      const span = span_from_tokens(schedule.tokens, start, end)
      throw new ParsingError(
        `Can not find choice: ${choice_name}\n` +
          `grammar: ${ut.inspect(Value.present(grammar))}\n`,
        { span }
      )
    }
    return parts
  }
}

function harvest_body(
  schedule: Schedule.Schedule,
  parts: Array<{ name?: string; value: Value.Value }>,
  progress: Array<{ index: number; choice_name?: string }>,
  start: number
): Obj<Tree.Tree> {
  if (parts.length !== progress.length) {
    const span = span_from_tokens(schedule.tokens, start, start)
    throw new ParsingError(
      "[Schedule.harvest_body] Internal error\n" +
        "parts.length !== progress.length\n" +
        `parts.length: ${parts.length}\n` +
        `progress.length: ${progress.length}\n`,
      { span }
    )
  }

  const body: Obj<Tree.Tree> = {}

  let index = start
  for (let i = 0; i < parts.length; i++) {
    const entry = progress[i]
    const part = parts[i]
    if (part.name) {
      body[part.name] = harvest_value(schedule, part.value, entry, index)
    }
    index = entry.index
  }

  return body
}

function harvest_value(
  schedule: Schedule.Schedule,
  value: Value.Value,
  entry: { index: number; choice_name?: string },
  index: number
): Tree.Tree {
  if (entry.choice_name) {
    if (value.kind === "Value.grammar") {
      return harvest_node(schedule, value, index, entry.index)
    } else {
      const span = span_from_tokens(schedule.tokens, index, entry.index)
      throw new ParsingError(
        "The value should be Value.grammar.\n" +
          `value: ${ut.inspect(Value.present(value))}\n`,
        { span }
      )
    }
  } else {
    const token = schedule.tokens[entry.index - 1]
    return Tree.leaf(token)
  }
}

function span_from_tokens(
  tokens: Array<Token.Token>,
  start: number,
  end: number
): Span.Span {
  if (tokens.length === 0) return { lo: 0, hi: 0 }

  if (start === end) {
    const token = tokens[start] || tokens[tokens.length - 1]
    return token.span
  } else {
    const lo = tokens[start].span.lo
    const hi = tokens[end - 1].span.hi
    return { lo, hi }
  }
}
