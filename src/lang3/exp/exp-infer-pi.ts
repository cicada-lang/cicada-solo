import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { infer_cls } from "./exp-infer-cls"

export function infer_pi(ctx: Ctx.Ctx, pi: Exp.pi): Value.Value {
  Exp.check(ctx, pi.arg_t, Value.type)
  const arg_t = Exp.evaluate(Ctx.to_env(ctx), pi.arg_t)
  ctx = Ctx.extend(ctx, pi.name, arg_t)
  Exp.check(ctx, pi.ret_t, Value.type)
  return Value.type
}
