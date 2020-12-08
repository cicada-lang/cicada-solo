import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Pattern from "../pattern"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Trace from "../../trace"

export type EvaluationOpts = {
  mode?: EvaluationMode
}

export enum EvaluationMode {
  mute_recursive_exp_in_mod = "mute_recursive_exp_in_mod",
}

export function evaluate(
  mod: Mod.Mod,
  env: Env.Env,
  exp: Exp.Exp,
  opts: EvaluationOpts = {}
): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        return exp.evaluability({ mod, env, mode: opts.mode })
      }
      case "Exp.pi": {
        return exp.evaluability({ mod, env, mode: opts.mode })
      }
      case "Exp.fn": {
        return exp.evaluability({ mod, env, mode: opts.mode })
      }
      case "Exp.case_fn": {
        return exp.evaluability({ mod, env, mode: opts.mode })
      }
      case "Exp.ap": {
        return exp.evaluability({ mod, env, mode: opts.mode })
      }
      case "Exp.cls": {
        return exp.evaluability({ mod, env, mode: opts.mode })
      }
      case "Exp.obj": {
        return exp.evaluability({ mod, env, mode: opts.mode })
      }
      case "Exp.dot": {
        return exp.evaluability({ mod, env, mode: opts.mode })
      }
      case "Exp.equal": {
        return Value.equal(
          Evaluate.evaluate(mod, env, exp.t, opts),
          Evaluate.evaluate(mod, env, exp.from, opts),
          Evaluate.evaluate(mod, env, exp.to, opts)
        )
      }
      case "Exp.same": {
        return Value.same
      }
      case "Exp.replace": {
        return Evaluate.do_replace(
          Evaluate.evaluate(mod, env, exp.target, opts),
          Evaluate.evaluate(mod, env, exp.motive, opts),
          Evaluate.evaluate(mod, env, exp.base, opts)
        )
      }
      case "Exp.absurd": {
        return Value.absurd
      }
      case "Exp.absurd_ind": {
        return Evaluate.do_absurd_ind(
          Evaluate.evaluate(mod, env, exp.target, opts),
          Evaluate.evaluate(mod, env, exp.motive, opts)
        )
      }
      case "Exp.str": {
        return Value.str
      }
      case "Exp.quote": {
        return Value.quote(exp.str)
      }
      case "Exp.union": {
        const { left, right } = exp
        return Value.union(
          Evaluate.evaluate(mod, env, left, opts),
          Evaluate.evaluate(mod, env, right, opts)
        )
      }
      case "Exp.type_constructor": {
        return Value.type_constructor(
          exp.name,
          Evaluate.evaluate(mod, env, exp.t, opts),
          Value.DelayedSums.create(exp.sums, mod, env)
        )
      }
      case "Exp.type": {
        return Value.type
      }
      case "Exp.begin": {
        env = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(mod, env, stmt)
        }
        return Evaluate.evaluate(mod, env, exp.ret, opts)
      }
      case "Exp.the": {
        return Evaluate.evaluate(mod, env, exp.exp, opts)
      }
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }

    throw error
  }
}
