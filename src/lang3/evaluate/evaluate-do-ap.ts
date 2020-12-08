import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.fn") return Value.Closure.apply(target.ret_cl, arg)
  if (target.kind === "Value.case_fn") return do_ap_case_fn(target, arg)
  if (target.kind === "Value.cls") return do_ap_cls(target, arg)
  if (target.kind === "Value.typecons")
    return do_ap_typecons(target, arg)
  if (target.kind === "Value.datatype") return do_ap_datatype(target, arg)
  if (target.kind === "Value.datacons")
    return do_ap_datacons(target, arg)
  if (target.kind === "Value.data") return do_ap_data(target, arg)
  if (target.kind === "Value.not_yet") return do_ap_not_yet(target, arg)

  throw new Trace.Trace(
    Explain.explain_elim_target_mismatch({
      elim: "ap",
      expecting: ["Value.fn", "Value.cls", "Value.not_yet"],
      reality: target.kind,
    })
  )
}

export function do_ap_case_fn(
  case_fn: Value.case_fn,
  arg: Value.Value
): Value.Value {
  if (arg.kind === "Value.not_yet") {
    if (arg.t.kind === "Value.pi")
      return Value.not_yet(
        Value.Closure.apply(arg.t.ret_t_cl, arg),
        Neutral.match(case_fn, arg.t, arg.neutral)
      )

    throw new Trace.Trace(
      Explain.explain_elim_target_type_mismatch({
        elim: "match",
        expecting: ["Value.pi"],
        reality: arg.t.kind,
      })
    )
  }

  for (const ret_cl of case_fn.ret_cl) {
    try {
      return Value.Closure.apply(ret_cl, arg)
    } catch (error) {
      if (error instanceof Trace.Trace) {
        // NOTE pass
      } else {
        throw error
      }
    }
  }

  throw new Trace.Trace("case_fn mismatch")
}

export function do_ap_cls(cls: Value.cls, arg: Value.Value): Value.cls {
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

export function do_ap_typecons(
  typecons: Value.typecons,
  arg: Value.Value
): Value.datatype {
  if (typecons.t.kind === "Value.pi") {
    const pi = typecons.t
    const remain_t = Value.Closure.apply(pi.ret_t_cl, arg)
    return Value.datatype(typecons, [arg], remain_t)
  }

  throw new Trace.Trace("expecting typecons.t to be Value.pi")
}

export function do_ap_datatype(
  datatype: Value.datatype,
  arg: Value.Value
): Value.datatype {
  if (datatype.t.kind === "Value.pi") {
    const pi = datatype.t
    const remain_t = Value.Closure.apply(pi.ret_t_cl, arg)
    return Value.datatype(
      datatype.typecons,
      [...datatype.args, arg],
      remain_t
    )
  }

  throw new Trace.Trace("expecting datatype.t to be Value.pi")
}

export function do_ap_datacons(
  datacons: Value.datacons,
  arg: Value.Value
): Value.data {
  if (datacons.t.kind === "Value.pi") {
    const pi = datacons.t
    const remain_t = Value.Closure.apply(pi.ret_t_cl, arg)
    return Value.data(datacons, [arg], remain_t)
  }

  throw new Trace.Trace("expecting datacons.t to be Value.pi")
}

export function do_ap_data(data: Value.data, arg: Value.Value): Value.data {
  if (data.t.kind === "Value.pi") {
    const pi = data.t
    const remain_t = Value.Closure.apply(pi.ret_t_cl, arg)
    return Value.data(data.datacons, [...data.args, arg], remain_t)
  }

  throw new Trace.Trace("expecting data.t to be Value.pi")
}

export function do_ap_not_yet(
  not_yet: Value.not_yet,
  arg: Value.Value
): Value.not_yet {
  if (not_yet.t.kind === "Value.pi")
    return Value.not_yet(
      Value.Closure.apply(not_yet.t.ret_t_cl, arg),
      Neutral.ap(not_yet.neutral, Normal.create(not_yet.t.arg_t, arg))
    )

  throw new Trace.Trace(
    Explain.explain_elim_target_type_mismatch({
      elim: "ap",
      expecting: ["Value.pi"],
      reality: not_yet.t.kind,
    })
  )
}
