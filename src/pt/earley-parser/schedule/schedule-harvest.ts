import * as Schedule from "../schedule"
import * as TaskChart from "../task-chart"
import * as Task from "../task"
import * as Value from "../../value"
import * as Token from "../../token"
import * as Tree from "../../tree"
import * as Span from "../../span"
import { Obj } from "../../../ut"

export function harvest(schedule: Schedule.Schedule): Tree.Tree {
  const start = 0
  const end = schedule.chart.length - 1
  return harvest_node(schedule, schedule.grammar, start, end)
}

function harvest_node(
  schedule: Schedule.Schedule,
  grammar: Value.grammar,
  start: number,
  end: number
): Tree.node {
  for (const task of TaskChart.tasks_at(schedule.chart, end)) {
    if (
      start === task.index &&
      end === Task.current_index(task) &&
      task.progress.length === task.parts.length
    ) {
      if (Task.match_grammar_p(task, grammar)) {
        const head = { name: grammar.name, kind: task.choice_name }
        const choices = Value.DelayedChoices.force(grammar.delayed)
        const parts = choices.get(task.choice_name)
        if (parts === undefined)
          throw new Error(`can not find choice: ${task.choice_name}`)
        const body = harvest_body(schedule, parts, task.progress, start)
        const span = span_from_tokens(schedule.tokens, start, end)
        return Tree.node(head, body, span)
      }
    }
  }

  throw new Error("PARSING_ERROR")
}

function span_from_tokens(
  tokens: Array<Token.Token>,
  token_lo: number,
  token_hi: number
): Span.Span {
  if (tokens.length === 0) return { lo: 0, hi: 0 }

  if (token_lo === token_hi) {
    const token = tokens[token_lo] || tokens[tokens.length - 1]
    return token.span
  } else {
    const lo = tokens[token_lo].span.lo
    const hi = tokens[token_hi - 1].span.hi
    return { lo, hi }
  }
}

function harvest_body(
  schedule: Schedule.Schedule,
  parts: Array<{ name?: string; value: Value.Value }>,
  progress: Array<{ index: number; choice_name?: string }>,
  start: number
): Obj<Tree.Tree> {
  if (parts.length !== progress.length) {
    throw new Error("parts.length !== progress.length")
  }

  const body: Obj<Tree.Tree> = {}
  let index = start

  for (let i = 0; i < parts.length; i++) {
    const entry = progress[i]
    const part = parts[i]
    if (entry.choice_name) {
      if (part.value.kind === "Value.grammar") {
        if (part.name) {
          const grammar = part.value
          const node = harvest_node(schedule, grammar, index, entry.index)
          body[part.name] = node
        }
        index = entry.index
      } else {
        throw new Error(
          `expecting Value.grammar instead of: ${part.value.kind}`
        )
      }
    } else {
      if (part.name) {
        const token = schedule.tokens[entry.index - 1]
        const leaf = Tree.leaf(token)
        body[part.name] = leaf
      }
      index = entry.index
    }
  }

  return body
}
