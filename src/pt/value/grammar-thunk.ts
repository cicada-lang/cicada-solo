import * as Env from "../env"
import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Value from "../value"

export interface GrammarThunk {
  name: string
  choices: Map<string, Array<Exp.GrammarPart>>
  mod: Mod.Mod
  env: Env.Env
}

// export function value(
//   cl: ClosedGrammar,
//   args: Array<Value.Value>
// ): Array<Value.Value> {
//   const { name, exp, mod, env } = cl
//   return Exp.evaluate(mod, Env.extend(env, name, args), exp)
// }
