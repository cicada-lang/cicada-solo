import * as pt from "../"
import * as ut from "../../ut"

export function grammar_start(
  grammars: pt.Mod.Present,
  start: string
): pt.Value.grammar {
  const mod = pt.Mod.from_present(grammars)
  const grammar = pt.Mod.dot(mod, start)

  if (grammar.kind !== "Value.grammar") {
    throw new Error(
      `Expecting grammar to be Value.grammar.\n` +
        `start: ${start}\n` +
        `grammar: ${ut.inspect(pt.Value.present(grammar))}\n`
    )
  }

  return grammar
}
