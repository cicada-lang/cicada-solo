import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function dot(tel: Telescope.Telescope, name: string): Value.Value {
  const { next, scope } = tel
  let { env } = tel

  env = Env.clone(env)
  const value = loop(env, next, scope, name)
  if (value === undefined) {
    throw new Trace.Trace(
      ut.aline(`
      |I can not find the name in the telescope.
      |- name: ${name}
      |- telescope: ${ut.inspect(tel)}
      |`)
    )
  }

  return value
}

function loop(
  env: Env.Env,
  next: undefined | { name: string; t: Value.Value },
  scope: Array<{ name: string; t: Exp.Exp }>,
  name: string
): undefined | Value.Value {
  if (next === undefined) {
    return undefined
  }

  if (next.name === name) {
    return next.t
  }

  const next_value = Value.not_yet(next.t, Neutral.v(next.name))
  env = Env.update(env, next.name, next_value)

  const [entry, ...rest] = scope
  const t = Exp.evaluate(env, entry.t)
  next = { name: entry.name, t }

  return loop(env, next, rest, name)
}
