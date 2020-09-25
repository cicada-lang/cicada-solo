import * as Schedule from "../schedule"
import * as Value from "../../../value"
import * as Token from "../../../token"

export function init(
  tokens: Array<Token.Token>,
  grammar: Value.grammar
): Schedule.Schedule {
  const queue = new Array()
  const chart = new Array()

  for (let i = 0; i < tokens.length + 1; i++) {
    chart.push(new Map())
  }

  if (chart.length !== tokens.length + 1) {
    throw new Error(
      "chart.length !== tokens.length + 1\n" +
        `chart.length: ${chart.length}\n` +
        `tokens.length: ${tokens.length}\n`
    )
  }

  const schedule = { tokens, grammar, queue, chart }
  Schedule.add_grammar(schedule, grammar, 0)
  return schedule
}
