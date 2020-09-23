import * as Machine from "../machine"
import * as Token from "../../../token"
import * as Value from "../../../value"
import * as ut from "../../../../ut"

export function recognize(
  tokens: Array<Token.Token>,
  grammar: Value.Value
): boolean {
  if (grammar.kind === "Value.grammar") {
    const machine = Machine.init(tokens, grammar)
    Machine.run(machine)
    const end = machine.schedule.chart[machine.schedule.chart.length - 1]
    for (const task of end.values()) {
      if (
        grammar.name === task.grammar_name &&
        task.current_index === tokens.length
      ) {
        return true
      }
    }
    return false
  } else {
    throw new Error(
      `expecting grammar to be Value.grammar.\n` +
        `grammar: ${ut.inspect(grammar)}\n`
    )
  }
}
