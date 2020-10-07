import * as Exp from "../exp"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Trace from "../../trace"

export function do_fill(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.cls") {
    const { tel } = target
    return Value.cls(Telescope.fill(tel, arg))
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "dot",
        expecting: ["Value.cls"],
        reality: target.kind,
      })
    )
  }
}
