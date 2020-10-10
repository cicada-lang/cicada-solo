import * as Exp from "../exp"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Trace from "../../trace"

export function do_fill(target: Value.Value, value: Value.Value): Value.Value {
  if (target.kind === "Value.cls") {
    const { sat, tel } = target
    const { next } = tel
    if (next === undefined) {
      throw new Trace.Trace("target cls is full")
    }
    const { name, t } = next
    return Value.cls([...sat, { name, t, value }], Telescope.fill(tel, value))
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
