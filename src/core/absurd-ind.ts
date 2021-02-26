import { Exp, AlphaCtx } from "../exp"
import { evaluate } from "../evaluate"
import { check } from "../check"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import * as Explain from "../explain"
import { Normal } from "../normal"
import { Trace } from "../trace"
import { NotYetValue } from "../core"
import { AbsurdValue, AbsurdIndNeutral } from "../core"
import { TypeValue } from "../core"

export class AbsurdInd implements Exp {
  target: Exp
  motive: Exp

  constructor(target: Exp, motive: Exp) {
    this.target = target
    this.motive = motive
  }

  evaluate(env: Env): Value {
    return AbsurdInd.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive)
    )
  }

  infer(ctx: Ctx): Value {
    // NOTE the `motive` here is not a function from target_t to type,
    //   but a element of type.
    // NOTE We should always infer target,
    //   but we do a simple check for the simple absurd.
    check(ctx, this.target, new AbsurdValue())
    check(ctx, this.motive, new TypeValue())
    const motive_value = evaluate(ctx.to_env(), this.motive)
    return motive_value
  }

  repr(): string {
    return `absurd_ind(${this.target.repr()}, ${this.motive.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `absurd_ind(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )})`
  }

  static apply(target: Value, motive: Value): Value {
    if (target instanceof NotYetValue) {
      if (target.t instanceof AbsurdValue) {
        return new NotYetValue(
          motive,
          new AbsurdIndNeutral(
            target.neutral,
            new Normal(new TypeValue(), motive)
          )
        )
      } else {
        throw new Trace(
          Explain.explain_elim_target_type_mismatch({
            elim: "absurd_ind",
            expecting: ["Value.absurd"],
            reality: target.t.constructor.name,
          })
        )
      }
    } else {
      throw new Trace(
        Explain.explain_elim_target_mismatch({
          elim: "absurd_ind",
          expecting: ["new NotYetValue"],
          reality: target.constructor.name,
        })
      )
    }
  }
}
