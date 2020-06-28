import * as Exp from "../exp"
import * as Ty from "../ty"
import * as Env from "../env"
import * as Value from "../value"
import * as ut from "../../ut"

export function do_rec(
  rec: Exp.Rec,
  t: Ty.Ty,
  target: Value.Value,
  base: Value.Value,
  step: Value.Value
): Value.Value {
  switch (target.kind) {
    default: {
      throw new Exp.Trace.Trace(
        rec,
        ut.aline(`
          |This is a internal error.
          |During do_rec, I expect the target.kind to be
          |  Value.Zero or Value.Succ or Value.Neutral,
          |but the target.kind is ${target.kind}.
          |`)
      )
    }
  }
}
