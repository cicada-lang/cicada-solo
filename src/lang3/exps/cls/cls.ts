import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export type Cls = Evaluable & {
  kind: "Exp.cls"
  sat: Array<{ name: string; t: Exp; exp: Exp }>
  scope: Array<{ name: string; t: Exp }>
}

export function Cls(
  sat: Array<{ name: string; t: Exp; exp: Exp }>,
  scope: Array<{ name: string; t: Exp }>
): Cls {
  return {
    kind: "Exp.cls",
    sat,
    scope,
    evaluability(the) {
      const env = Env.clone(the.env)
      const sat = new Array()
      for (const entry of sat) {
        const name = entry.name
        const t = Evaluate.evaluate(the.mod, env, entry.t, { mode: the.mode })
        const value = Evaluate.evaluate(the.mod, env, entry.exp, {
          mode: the.mode,
        })
        sat.push({ name, t, value })
        Env.update(env, name, value)
      }
      if (scope.length === 0) {
        return Value.cls(
          sat,
          Value.Telescope.create(the.mod, env, undefined, new Array())
        )
      } else {
        const [entry, ...tail] = scope
        const name = entry.name
        const t = Evaluate.evaluate(the.mod, env, entry.t, { mode: the.mode })
        return Value.cls(
          sat,
          Value.Telescope.create(the.mod, env, { name, t }, tail)
        )
      }
    },
  }
}
