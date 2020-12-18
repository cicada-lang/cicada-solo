import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Env from "../../env"

export function cls_evaluable(
  sat: Array<{ name: string; t: Exp; exp: Exp }>,
  scope: Array<{ name: string; t: Exp }>
): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode }) => {
      env = Env.clone(env)
      const new_sat = new Array()
      for (const entry of sat) {
        const name = entry.name
        const t = evaluate(entry.t, { mod, env, mode })
        const value = evaluate(entry.exp, { mod, env, mode })
        new_sat.push({ name, t, value })
        Env.update(env, name, value)
      }
      if (scope.length === 0) {
        return Value.cls(
          new_sat,
          Value.Telescope.create(mod, env, undefined, new Array())
        )
      } else {
        const [entry, ...tail] = scope
        const name = entry.name
        const t = evaluate(entry.t, { mod, env, mode })
        return Value.cls(
          new_sat,
          Value.Telescope.create(mod, env, { name, t }, tail)
        )
      }
    },
  })
}
