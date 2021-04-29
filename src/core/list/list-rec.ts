import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { Trace } from "../../trace"
import { Type } from "../../core"
import { Var, Pi, Ap } from "../../core"
import {
  ListValue,
  Nil,
  NilValue,
  List,
  Li,
  LiValue,
  ListInd,
  ListIndNeutral,
} from "../../core"
import { PiValue } from "../../core"
import { NotYetValue } from "../../core"

export class ListRec implements Exp {
  target: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, base: Exp, step: Exp) {
    this.target = target
    this.base = base
    this.step = step
  }

  evaluate(env: Env): Value {
    throw new Error("TODO")
  }

  infer(ctx: Ctx): Value {
    throw new Error("TODO")
  }

  repr(): string {
    return `list_rec(${this.target.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `list_rec(${this.target.alpha_repr(ctx)}, ${this.base.alpha_repr(
      ctx
    )}, ${this.step.alpha_repr(ctx)})`
  }
}
