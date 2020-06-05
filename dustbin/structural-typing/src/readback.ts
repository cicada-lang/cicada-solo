import * as Exp from "./exp"
import * as Value from "./value"
import * as Neutral from "./neutral"
import * as Env from "./env"
import * as Scope from "./scope"
import * as Err from "./err"
import { evaluate } from "./evaluate"
import { infer } from "./infer"

export function readback(value: Value.Value): Exp.Exp {
  if (value instanceof Value.Type) {
    return new Exp.Type()
  } else if (value instanceof Value.StrType) {
    return new Exp.StrType()
  } else if (value instanceof Value.Str) {
    let { str } = value
    return new Exp.Str(str)
  } else if (value instanceof Value.Pi) {
    let { scope, return_type, scope_env } = value
    let { named_entries, new_scope_env } = scope_readback(scope, scope_env)
    return new Exp.Pi(
      new Scope.Scope(named_entries),
      readback(evaluate(new_scope_env, return_type))
    )
  } else if (value instanceof Value.Fn) {
    let { scope, body, scope_env } = value
    let { named_entries, new_scope_env } = scope_readback(scope, scope_env)
    return new Exp.Fn(
      new Scope.Scope(named_entries),
      readback(evaluate(new_scope_env, body))
    )
  } else if (value instanceof Value.FnCase) {
    let { cases } = value
    return new Exp.FnCase(
      cases.map((fn) => {
        let { scope, body, scope_env } = fn
        let { named_entries, new_scope_env } = scope_readback(scope, scope_env)
        return new Exp.Fn(
          new Scope.Scope(named_entries),
          readback(evaluate(new_scope_env, body))
        )
      })
    )
  } else if (value instanceof Value.Cl) {
    let { defined, scope, scope_env } = value
    let named_entries_defined: Array<[string, Scope.Entry.Entry]> = []
    for (let [name, the] of defined) {
      let { t, value } = the
      named_entries_defined.push([
        name,
        new Scope.Entry.Define(readback(t), readback(value)),
      ])
    }
    let { named_entries } = scope_readback(scope, scope_env)
    return new Exp.Cl(
      new Scope.Scope([...named_entries_defined, ...named_entries])
    )
  } else if (value instanceof Value.Obj) {
    let { defined } = value
    let named_entries: Array<[string, Scope.Entry.Entry]> = []
    for (let [name, the] of defined) {
      let { t, value } = the
      named_entries.push([
        name,
        new Scope.Entry.Define(readback(t), readback(value)),
      ])
    }
    return new Exp.Obj(new Scope.Scope(named_entries))
  } else if (value instanceof Value.Equation) {
    let { t, lhs, rhs, equation_env } = value
    let lhs_value = evaluate(equation_env, lhs)
    let rhs_value = evaluate(equation_env, rhs)
    return new Exp.Equation(
      readback(t),
      readback(lhs_value),
      readback(rhs_value)
    )
  } else if (value instanceof Value.Same) {
    let same = value
    return new Exp.Same(readback(same.t), readback(same.value))
  } else if (value instanceof Value.TheNeutral) {
    let the = value
    return new Exp.The(readback(the.t), readback(the.value))
  } else if (value instanceof Neutral.Var) {
    let { name } = value
    return new Exp.Var(name)
  } else if (value instanceof Neutral.Ap) {
    let { target, args } = value
    return new Exp.Ap(
      readback(target),
      args.map((arg) => readback(arg))
    )
  } else if (value instanceof Neutral.Dot) {
    let { target, field_name } = value
    return new Exp.Dot(readback(target), field_name)
  } else if (value instanceof Neutral.Transport) {
    let { equation, motive, base } = value
    return new Exp.Transport(
      readback(equation),
      readback(motive),
      readback(base)
    )
  } else {
    throw new Err.Unhandled(value)
  }
}

function scope_readback(
  scope: Scope.Scope,
  scope_env: Env.Env
): {
  named_entries: Array<[string, Scope.Entry.Entry]>
  new_scope_env: Env.Env
} {
  let named_entries: Array<[string, Scope.Entry.Entry]> = []

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(scope_env, value),
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      named_entries.push([name, new Scope.Entry.Let(readback(the.value))])
    } else if (entry instanceof Scope.Entry.Given) {
      let { t } = entry
      let t_value = evaluate(scope_env, t)
      let the = {
        t: t_value,
        value: new Value.TheNeutral(t_value, new Neutral.Var(name)),
      }
      scope_env = scope_env.ext(name, the)
      named_entries.push([name, new Scope.Entry.Given(readback(the.t))])
    } else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(scope_env, t),
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      named_entries.push([
        name,
        new Scope.Entry.Define(readback(the.t), readback(the.value)),
      ])
    } else {
      throw new Err.Unhandled(entry)
    }
  }

  return {
    named_entries,
    new_scope_env: scope_env,
  }
}
