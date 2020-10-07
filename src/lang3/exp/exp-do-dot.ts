import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Telescope from "../telescope"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function do_dot(target: Value.Value, name: string): Value.Value {
  if (target.kind === "Value.obj") {
    const value = target.properties.get(name)
    if (value === undefined) {
      throw new Trace.Trace(
        ut.aline(`
          |the property name ${name} is undefined.
          |`)
      )
    }
    return value
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.cls") {
      return Value.not_yet(
        Telescope.dot(target.t.tel, name),
        Neutral.dot(target.neutral, name)
      )
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "dot",
          expecting: ["Value.cls"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "dot",
        expecting: ["Value.obj", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}
