import * as Schedule from "../schedule"
import * as Task from "../task"
import * as Token from "../../../token"
import * as Value from "../../../value"
import * as Tree from "../../../tree"
import * as ut from "../../../../ut"

export function parse(
  tokens: Array<Token.Token>,
  grammar: Value.Value,
  opts: Schedule.Opts = Schedule.DEFAULT_OPTS
): Tree.Tree {
  if (grammar.kind !== "Value.grammar") {
    throw new Error(
      `expecting grammar to be Value.grammar.\n` +
        `grammar: ${ut.inspect(grammar)}\n`
    )
  }

  const schedule = Schedule.init(tokens, grammar)
  Schedule.run(schedule, opts)
  return Schedule.collect(schedule)
}
