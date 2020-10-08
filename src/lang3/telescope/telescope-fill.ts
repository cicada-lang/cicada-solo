import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function fill(
  tel: Telescope.Telescope,
  value: Value.Value
): Telescope.Telescope {
  let { env, sat, next, scope } = tel
  if (next === undefined)
    throw new Trace.Trace(
      ut.aline(`
        |Filling fulled telescope.
        |- telescope: ${ut.inspect(tel)}
        |- value: ${ut.inspect(value)}
        |`)
    )

  env = Env.extend(env, next.name, value)
  sat = [...sat, { name: next.name, t: next.t, value }]
  const [entry, ...rest] = scope
  const t = Exp.evaluate(env, entry.t)
  return Telescope.create(env, sat, { name: entry.name, t }, rest)
}
