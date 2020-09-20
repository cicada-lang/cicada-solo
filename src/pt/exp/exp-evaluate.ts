import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"

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
      throw new Error()
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
      const choices = new Map()
      for (const [name, parts] of exp.choices) {
        type Part = { name?: string; value: Value.Value }
        const new_parts: Array<Part> = new Array()
        for (const part of parts) {
          if (part.name) {
            for (const value of evaluate(mod, env, part.value)) {
              if (pickup_p(value)) {
                new_parts.push({ name: part.name, value })
              } else {
                new_parts.push({ value })
              }
            }
          } else {
            for (const value of evaluate(mod, env, part.value)) {
              new_parts.push({ value })
            }
          }
        }
        choices.set(name, new_parts)
      }
      return new Array(Value.gr(exp.name, choices))
    }
  }
}

function pickup_p(value: Value.Value): boolean {
  return value.kind === "Value.gr" || value.kind === "Value.pattern"
}

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
