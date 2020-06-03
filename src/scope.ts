import * as Exp from "./exp"
import * as Value from "./value"
import * as Neutral from "./neutral"
import * as Env from "./env"
import * as ut from "./ut"
import { evaluate } from "./evaluate"
import { check } from "./check"
import { subtype } from "./subtype"
import { infer } from "./infer"
import { readback } from "./readback"
import * as Err from "./err"
import * as pretty from "./pretty"

export class Scope {
  constructor(public named_entries: Array<[string, Entry.Entry]> = []) {}

  get arity(): number {
    let n = 0
    for (let [_name, entry] of this.named_entries) {
      if (entry instanceof Entry.Given) {
        n += 1
      }
    }
    return n
  }

  lookup_value(name: string): undefined | Exp.Exp {
    let named_entry = this.named_entries.find(
      ([entry_name, _entry]) => name === entry_name
    )

    if (named_entry === undefined) {
      return undefined
    }

    let [_name, entry] = named_entry

    if (entry instanceof Entry.Let) {
      let { value } = entry
      return value
    } else if (entry instanceof Entry.Given) {
      return undefined
    } else if (entry instanceof Entry.Define) {
      let { value } = entry
      return value
    } else {
      throw new Err.Unhandled(entry)
    }
  }
}

export namespace Entry {
  export abstract class Entry {
    abstract_class_name: "Scope.Entry" = "Scope.Entry"
  }

  export class Let extends Entry {
    constructor(public value: Exp.Exp) {
      super()
    }
  }

  export class Given extends Entry {
    constructor(public t: Exp.Exp) {
      super()
    }
  }

  export class Define extends Entry {
    constructor(public t: Exp.Exp, public value: Exp.Exp) {
      super()
    }
  }
}

export function entry_to_type(entry: Entry.Entry, env: Env.Env): Value.Value {
  if (entry instanceof Entry.Let) {
    let { value } = entry
    return infer(env, value)
  } else if (entry instanceof Entry.Given) {
    let { t } = entry
    return evaluate(env, t)
  } else if (entry instanceof Entry.Define) {
    let { t } = entry
    return evaluate(env, t)
  } else {
    throw new Err.Unhandled(entry)
  }
}

export function scope_check_with_args(
  scope: Scope,
  scope_env: Env.Env,
  args: Array<Exp.Exp>,
  env: Env.Env,
  effect: (
    name: string,
    the: {
      t: Value.Value
      value: Value.Value
    }
  ) => void = (_) => {}
): Env.Env {
  let arg_index = 0

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(scope_env, value),
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    } else if (entry instanceof Entry.Given) {
      let arg = args[arg_index]
      if (arg === undefined) {
        break
      }
      arg_index += 1
      let { t } = entry
      let t_value = evaluate(scope_env, t)

      check(env, arg, t_value)
      let arg_value = evaluate(env, arg) // NOTE use the original `env`

      let the = {
        t: t_value,
        value: arg_value,
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    } else if (entry instanceof Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(scope_env, t),
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    } else {
      throw new Err.Unhandled(entry)
    }
  }

  return scope_env
}

export function scope_check_with_args_for_fn(
  scope: Scope,
  scope_env: Env.Env,
  args: Array<Exp.Exp>,
  env: Env.Env,
  effect: (
    name: string,
    the: {
      t: Value.Value
      value: Value.Value
    }
  ) => void = (_) => {}
): Env.Env {
  let arg_index = 0

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(scope_env, value),
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    } else if (entry instanceof Entry.Given) {
      let arg = args[arg_index]
      if (arg === undefined) {
        break
      }
      arg_index += 1
      let { t } = entry
      let t_value = evaluate(scope_env, t)

      try {
        check(env, arg, t_value)
        let arg_value = evaluate(env, arg) // NOTE use the original `env`
        let the = {
          t: t_value,
          value: arg_value,
        }
        scope_env = scope_env.ext(name, the)
        effect(name, the)
      } catch (error) {
        if (error instanceof Err.Report) {
          // NOTE if fail on `arg` give it another chance on `readback(arg_value)`.
          // NOTE we need to use `The` in given, because of the following readback,
          //   otherwise readback a free variable will lose,
          //   we need to add `The` and type on `Neutral.Var` to solve this.
          // NOTE this might be a bad solution.
          let arg_value = evaluate(env, arg) // NOTE use the original `env`
          check(env, readback(arg_value), t_value)
          let the = {
            t: t_value,
            value: arg_value,
          }
          scope_env = scope_env.ext(name, the)
          effect(name, the)
        } else {
          throw error
        }
      }
    } else if (entry instanceof Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(scope_env, t),
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    } else {
      throw new Err.Unhandled(entry)
    }
  }

  return scope_env
}

export function scope_check(
  scope: Scope,
  scope_env: Env.Env,
  effect: (
    name: string,
    the: {
      t: Value.Value
      value: Value.Value
    }
  ) => void = (_) => {}
): Env.Env {
  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Entry.Let) {
      let { value } = entry
      let t_value = infer(scope_env, value)
      let the = {
        t: t_value,
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    } else if (entry instanceof Entry.Given) {
      let { t } = entry
      check(scope_env, t, new Value.Type())
      let t_value = evaluate(scope_env, t)
      let the = {
        t: t_value,
        value: new Value.TheNeutral(t_value, new Neutral.Var(name)),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    } else if (entry instanceof Entry.Define) {
      let { t, value } = entry
      check(scope_env, t, new Value.Type())
      let t_value = evaluate(scope_env, t)
      check(scope_env, value, t_value)
      let the = {
        t: t_value,
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    } else {
      throw new Err.Unhandled(entry)
    }
  }

  return scope_env
}

export function scope_compare_given(
  s_scope: Scope,
  s_scope_env: Env.Env,
  t_scope: Scope,
  t_scope_env: Env.Env,
  effect: (name: string, s_given: Value.Value, t_given: Value.Value) => void = (
    _
  ) => {}
): [Env.Env, Env.Env] {
  let s_named_entry_iter = s_scope.named_entries.values()
  let t_named_entry_iter = t_scope.named_entries.values()

  let s_current: undefined | [string, Exp.Exp] = undefined
  let t_current: undefined | [string, Exp.Exp] = undefined

  function step(): boolean {
    if (s_current === undefined) {
      let result = s_named_entry_iter.next()
      if (result.value !== undefined) {
        let [name, entry] = result.value

        if (entry instanceof Entry.Let) {
          let { value } = entry
          let the = {
            t: infer(s_scope_env, value),
            value: evaluate(s_scope_env, value),
          }
          s_scope_env = s_scope_env.ext(name, the)
        } else if (entry instanceof Entry.Given) {
          let { t } = entry
          s_current = [name, t]
        } else if (entry instanceof Entry.Define) {
          let { t, value } = entry
          let the = {
            t: evaluate(s_scope_env, t),
            value: evaluate(s_scope_env, value),
          }
          s_scope_env = s_scope_env.ext(name, the)
        } else {
          throw new Err.Unhandled(entry)
        }
      }
    }

    if (t_current === undefined) {
      let result = t_named_entry_iter.next()
      if (result.value !== undefined) {
        let [name, entry] = result.value

        if (entry instanceof Entry.Let) {
          let { value } = entry
          let the = {
            t: infer(t_scope_env, value),
            value: evaluate(t_scope_env, value),
          }
          t_scope_env = t_scope_env.ext(name, the)
        } else if (entry instanceof Entry.Given) {
          let { t } = entry
          t_current = [name, t]
        } else if (entry instanceof Entry.Define) {
          let { t, value } = entry
          let the = {
            t: evaluate(t_scope_env, t),
            value: evaluate(t_scope_env, value),
          }
          t_scope_env = t_scope_env.ext(name, the)
        } else {
          throw new Err.Unhandled(entry)
        }
      }
    }

    if (s_current === undefined && t_current === undefined) {
      return false
    } else if (s_current !== undefined && t_current !== undefined) {
      let [[s_name, s], [t_name, t]] = [s_current, t_current]
      let s_value = evaluate(s_scope_env, s)
      let t_value = evaluate(t_scope_env, t)
      let unique_name = ut.unique_name(`${s_name}:${t_name}`)
      effect(unique_name, s_value, t_value)
      let unique_var = new Neutral.Var(unique_name)
      s_scope_env = s_scope_env.ext(s_name, { t: s_value, value: unique_var })
      t_scope_env = t_scope_env.ext(t_name, { t: t_value, value: unique_var })

      s_scope_env = s_scope_env.ext(unique_name, {
        t: s_value,
        value: unique_var,
      })
      t_scope_env = t_scope_env.ext(unique_name, {
        t: t_value,
        value: unique_var,
      })

      s_current = undefined
      t_current = undefined
      return true
    } else {
      return true
    }
  }

  let continue_p = true
  while (continue_p) {
    continue_p = step()
  }

  return [s_scope_env, t_scope_env]
}
