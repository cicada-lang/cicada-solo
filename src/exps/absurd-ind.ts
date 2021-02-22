import { Exp, AlphaReprOpts } from "../exp"

import { evaluate } from "../evaluate"
import { check } from "../check"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import * as Explain from "../explain"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../trace"

export class AbsurdInd implements Exp {
  kind = "AbsurdInd"
  target: Exp
  motive: Exp

  constructor(target: Exp, motive: Exp) {
    this.target = target
    this.motive = motive
  }

  evaluability({ env }: { env: Env }): Value.Value {
    return do_absurd_ind(evaluate(env, this.target), evaluate(env, this.motive))
  }

  inferability({ ctx }: { ctx: Ctx }): Value.Value {
    // NOTE the `motive` here is not a function from target_t to type,
    //   but a element of type.
    // NOTE We should always infer target,
    //   but we do a simple check for the simple absurd.
    check(ctx, this.target, Value.absurd)
    check(ctx, this.motive, Value.type)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    return motive_value
  }

  repr(): string {
    return `absurd_ind(${this.target.repr()}, ${this.motive.repr()})`
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return `absurd_ind(${this.target.alpha_repr(
      opts
    )}, ${this.motive.alpha_repr(opts)})`
  }
}

export function do_absurd_ind(
  target: Value.Value,
  motive: Value.Value
): Value.Value {
  if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.absurd") {
      return Value.not_yet(
        motive,
        Neutral.absurd_ind(target.neutral, Normal.create(Value.type, motive))
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "absurd_ind",
          expecting: ["Value.absurd"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "absurd_ind",
        expecting: ["Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
