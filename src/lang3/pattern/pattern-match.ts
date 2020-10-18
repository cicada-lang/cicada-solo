import * as Pattern from "../pattern"
import * as Value from "../value"
import * as Env from "../env"
import * as ut from "../../ut"

export function match(
  env: Env.Env,
  pattern: Pattern.Pattern,
  value: Value.Value
): undefined | Env.Env {
  return match_with(env, pattern, value, new Map())
}

// NOTE side effect on `matched_values`
function match_with(
  env: Env.Env,
  pattern: Pattern.Pattern,
  value: Value.Value,
  matched_values: Map<string, Value.Value>
): undefined | Env.Env {
  switch (pattern.kind) {
    case "Pattern.v": {
      const matched_value = matched_values.get(pattern.name)
      if (matched_value === undefined) {
        matched_values.set(pattern.name, value)
        return Env.extend(env, pattern.name, value)
      }
      // NOTE not `Value.conversion()` because we do not have `ctx`
      if (ut.equal(matched_value, value)) return env
      return undefined
    }
    case "Pattern.datatype": {
      if (
        value.kind === "Value.datatype" &&
        value.type_constructor.name === pattern.name
      ) {
        return match_args_with(env, pattern.args, value.args, matched_values)
      }
      return undefined
    }
    case "Pattern.data": {
      if (
        value.kind === "Value.data" &&
        value.data_constructor.type_constructor.name === pattern.name &&
        value.data_constructor.tag === pattern.tag
      ) {
        return match_args_with(env, pattern.args, value.args, matched_values)
      }
      return undefined
    }
  }
}

function match_args_with(
  env: Env.Env,
  patterns: Array<Pattern.Pattern>,
  args: Array<Value.Value>,
  matched_values: Map<string, Value.Value>
): undefined | Env.Env {
  if (patterns.length !== args.length) return undefined
  let result: undefined | Env.Env = env
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i]
    const arg = args[i]
    result = match_with(result, pattern, arg, matched_values)
    if (result === undefined) return undefined
  }
  return result
}
