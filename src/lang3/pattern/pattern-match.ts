import * as Pattern from "../pattern"
import * as Value from "../value"
import * as Env from "../env"
import * as Mod from "../mod"
import * as ut from "../../ut"
import * as Evaluate from "../evaluate"

export function match(
  mod: Mod.Mod,
  env: Env.Env,
  pattern: Pattern.Pattern,
  value: Value.Value
): undefined | Env.Env {
  const result = match_pattern(mod, env, pattern, value, new Map())
  return result
}

// NOTE side effect on `matched`
function match_pattern(
  mod: Mod.Mod,
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

  // NOTE We can refine a not yet value whose neutral is a variable.
  //   the following can handle simple cases,
  //   but maybe we can find counterexamples.
  if (value.kind === "Value.not_yet" && value.neutral.kind === "Neutral.v") {
    return Env.extend(
      env,
      value.neutral.name,
      Pattern.to_value(mod, env, pattern, value.t)
    )
  }

  if (
    pattern.kind === "Pattern.datatype" &&
    value.kind === "Value.datatype" &&
    value.type_constructor.name === pattern.name
  ) {
    return match_patterns(mod, env, pattern.args, value.args, matched)
  }

  if (
    pattern.kind === "Pattern.data" &&
    value.kind === "Value.data" &&
    value.data_constructor.type_constructor.name === pattern.name &&
    value.data_constructor.tag === pattern.tag
  ) {
    return match_patterns(mod, env, pattern.args, value.args, matched)
  }

  if (
    pattern.kind === "Pattern.data" &&
    value.kind === "Value.data_constructor" &&
    value.type_constructor.name === pattern.name &&
    value.tag === pattern.tag
  ) {
    return match_patterns(mod, env, pattern.args, [], matched)
  }

  return undefined
}

// NOTE side effect on `matched`
function match_patterns(
  mod: Mod.Mod,
  env: Env.Env,
  patterns: Array<Pattern.Pattern>,
  values: Array<Value.Value>,
  matched: Map<string, Value.Value>
): undefined | Env.Env {
  if (patterns.length !== values.length) return undefined
  let result_env: undefined | Env.Env = env
  for (let i = 0; i < patterns.length; i++) {
    result_env = match_pattern(mod, result_env, patterns[i], values[i], matched)
    if (result_env === undefined) return undefined
  }
  return result_env
}
