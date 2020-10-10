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
  let { env, next, scope } = tel
  if (next === undefined) {
    throw new Trace.Trace(
      ut.aline(`
        |Filling fulled telescope.
        |- telescope: ${ut.inspect(tel)}
        |- value: ${ut.inspect(value)}
        |`)
    )
  }

  env = Env.extend(env, next.name, value)
  const [entry, ...rest] = scope
  if (entry === undefined) {
    return Telescope.create(env, undefined, rest)
  } else {
    const t = Exp.evaluate(env, entry.t)
    return Telescope.create(env, { name: entry.name, t }, rest)
  }
}
