import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"
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
        on_not_found: (name) => {
          throw new Error(`undefined name: ${name}`)
        },
      })
    }
    case "Exp.fn": {
      const { name, ret } = exp
      return Array.of(Value.fn({ name, exp: ret, env, mod }))
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
      return Array.of(Value.str(value))
    }
    case "Exp.pattern": {
      const { label, value } = exp
      return Array.of(Value.pattern(label, value))
    }
    case "Exp.grammar": {
      const { name, choices } = exp
      return Array.of(Value.grammar(name, { choices, mod, env }))
    }
  }
}

function lookup(
  mod: Mod.Mod,
  env: Env.Env,
  name: string,
  opts: {
    on_not_found: (name: string) => never
  }
): Array<Value.Value> {
  const values = Env.lookup(env, name)
  if (values) return values
  const exp = Mod.get(mod, name)
  if (exp) return evaluate(mod, env, exp)
  opts.on_not_found(name)
}

function do_ap(
  target: Value.Value,
  args: Array<Value.Value>
): Array<Value.Value> {
  if (target.kind === "Value.fn") {
    return Value.Closure.apply(target.ret_cl, args)
  } else {
    throw new Error(
      `expecting target to be Value.fn\n` + `target: ${ut.inspect(target)}\n`
    )
  }
}
