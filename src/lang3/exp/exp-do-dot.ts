import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function do_dot(target: Value.Value, name: string): Value.Value {
  if (target.kind === "Value.obj") return do_obj(target, name)
  if (target.kind === "Value.cls") return do_cls(target, name)
  if (target.kind === "Value.not_yet") return do_not_yet(target, name)
  throw new Trace.Trace(
    Exp.explain_elim_target_mismatch({
      elim: "dot",
      expecting: ["Value.obj", "Value.cls", "Value.not_yet"],
      reality: target.kind,
    })
  )
}

function do_obj(obj: Value.obj, name: string): Value.Value {
  const value = obj.properties.get(name)
  if (value === undefined)
    throw new Trace.Trace(`the property name ${name} is undefined.`)

  return value
}

function do_cls(cls: Value.cls, name: string): Value.Value {
  for (const entry of cls.sat) {
    if (entry.name === name) {
      return entry.t
    }
  }

  return Value.Telescope.dot(cls.tel, name)
}

function do_not_yet(not_yet: Value.not_yet, name: string): Value.not_yet {
  if (not_yet.t.kind === "Value.cls")
    return Value.not_yet(
      Value.Telescope.dot(not_yet.t.tel, name),
      Neutral.dot(not_yet.neutral, name)
    )

  throw new Trace.Trace(
    Exp.explain_elim_target_type_mismatch({
      elim: "dot",
      expecting: ["Value.cls"],
      reality: not_yet.t.kind,
    })
  )
}
