import * as Exp from "../exp"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.fn") return Value.Closure.apply(target.ret_cl, arg)
  if (target.kind === "Value.cls") return ap_cls(target, arg)
  if (target.kind === "Value.type_constructor")
    return ap_type_constructor(target, arg)
  if (target.kind === "Value.not_yet") return ap_not_yet(target, arg)

  throw new Trace.Trace(
    Exp.explain_elim_target_mismatch({
      elim: "ap",
      expecting: ["Value.fn", "Value.cls", "Value.not_yet"],
      reality: target.kind,
    })
  )
}

function ap_cls(cls: Value.cls, arg: Value.Value): Value.cls {
  if (cls.tel.next === undefined) throw new Trace.Trace("cls is full")

  return Value.cls(
    [
      ...cls.sat,
      {
        name: cls.tel.next.name,
        t: cls.tel.next.t,
        value: arg,
      },
    ],
    Value.Telescope.fill(cls.tel, arg)
  )
}

function ap_type_constructor(
  type_constructor: Value.type_constructor,
  arg: Value.Value
): Value.datatype {
  if (type_constructor.t.kind === "Value.pi") {
    const pi = type_constructor.t
    const remain_t = Value.Closure.apply(pi.ret_t_cl, arg)
    return Value.datatype(type_constructor, [arg], remain_t)
  }

  throw new Trace.Trace("expecting type_constructor.t to be Value.pi")
}

function ap_not_yet(not_yet: Value.not_yet, arg: Value.Value): Value.not_yet {
  if (not_yet.t.kind === "Value.pi")
    return Value.not_yet(
      Value.Closure.apply(not_yet.t.ret_t_cl, arg),
      Neutral.ap(not_yet.neutral, new Normal.Normal(not_yet.t.arg_t, arg))
    )

  throw new Trace.Trace(
    Exp.explain_elim_target_type_mismatch({
      elim: "ap",
      expecting: ["Value.pi"],
      reality: not_yet.t.kind,
    })
  )
}
