import * as Pattern from "../pattern"
import * as Value from "../value"
import * as Env from "../env"
import * as ut from "../../ut"

export function match(
  env: Env.Env,
  pattern: Pattern.Pattern,
  value: Value.Value
): undefined | Env.Env {
  return match_pattern(env, pattern, value, new Map())
}

// NOTE side effect on `matched`
function match_pattern(
  env: Env.Env,
  pattern: Pattern.Pattern,
  value: Value.Value,
  matched: Map<string, Value.Value>
): undefined | Env.Env {
  if (pattern.kind === "Pattern.v") {
    const found = matched.get(pattern.name)
    if (found === undefined) {
      matched.set(pattern.name, value)
      return Env.extend(env, pattern.name, value)
    }
    // NOTE not `Value.conversion()` because we do not have `ctx`
    if (ut.equal(found, value)) return env
    return undefined
  }

  if (
    pattern.kind === "Pattern.datatype" &&
    value.kind === "Value.datatype" &&
    value.type_constructor.name === pattern.name
  ) {
    return match_patterns(env, pattern.args, value.args, matched)
  }

  if (
    pattern.kind === "Pattern.data" &&
    value.kind === "Value.data" &&
    value.data_constructor.type_constructor.name === pattern.name &&
    value.data_constructor.tag === pattern.tag
  ) {
    return match_patterns(env, pattern.args, value.args, matched)
  }

  return undefined
}

// NOTE side effect on `matched`
function match_patterns(
  env: Env.Env,
  patterns: Array<Pattern.Pattern>,
  values: Array<Value.Value>,
  matched: Map<string, Value.Value>
): undefined | Env.Env {
  if (patterns.length !== values.length) return undefined
  let result_env: undefined | Env.Env = env
  for (let i = 0; i < patterns.length; i++) {
    result_env = match_pattern(result_env, patterns[i], values[i], matched)
    if (result_env === undefined) return undefined
  }
  return result_env
}
