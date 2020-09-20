import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"
import * as ut from "../../ut"

export function evaluate(
  mod: Mod.Mod,
  env: Env.Env,
  exp: Exp.Exp
): Array<Value.Value> {
  switch (exp.kind) {
    case "Exp.v": {
      const { name } = exp
      return lookup(mod, env, name, {
        on_not_found: () => {
          throw new Error(`undefined name: ${name}`)
        },
      })
    }
    case "Exp.fn": {
      const { name, ret } = exp
      const ret_cl = { name, exp: ret, env, mod }
      return new Array(Value.fn(ret_cl))
    }
    case "Exp.ap": {
      const result = evaluate(mod, env, exp.target)
      if (result.length !== 1)
        throw new Error(
          `target of Exp.ap should evaluates only one value.\n` +
            `target: ${ut.inspect(exp.target)}\n`
        )
      const target = result[0]
      const args = exp.args.flatMap((arg) => evaluate(mod, env, arg))
      return do_ap(target, args)
    }
    case "Exp.str": {
      const { value } = exp
      return new Array(Value.str(value))
    }
    case "Exp.pattern": {
      const { label, value } = exp
      return new Array(Value.pattern(label, value))
    }
    case "Exp.gr": {
      const new_choices = new Map()
      for (const [name, parts] of exp.choices) {
        new_choices.set(
          name,
          parts.flatMap((part) => evaluate_part(mod, env, part))
        )
      }
      return new Array(Value.gr(exp.name, new_choices))
    }
  }
}

const evaluate_part = (
  mod: Mod.Mod,
  env: Env.Env,
  part: { name?: string; value: Exp.Exp }
) =>
  evaluate(mod, env, part.value).map((value) =>
    part.name && pickup_p(value) ? { value, name: part.name } : { value }
  )

const pickup_p = (value: Value.Value) =>
  value.kind === "Value.gr" || value.kind === "Value.pattern"

function lookup(
  mod: Mod.Mod,
  env: Env.Env,
  name: string,
  opts: {
    on_not_found: () => never
  }
): Array<Value.Value> {
  const values = env.get(name)
  if (values) return values
  const exp = mod.get(name)
  if (exp) return evaluate(mod, env, exp)
  opts.on_not_found()
}

function do_ap(target: Value.Value, args: Array<Value.Value>): Array<Value.Value> {
  if (target.kind === "Value.fn") {
    return Closure.apply(target.ret_cl, args)
  } else {
    throw new Error(
      `expecting target to be Value.fn\n` + `target: ${ut.inspect(target)}\n`
    )
  }
}
