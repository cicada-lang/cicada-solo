import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"

import { evaluate } from "../../evaluable"
import * as Explain from "../../explain"
import * as Mod from "../../mod"
import * as Modpath from "../../modpath"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const dot_evaluable = (target: Exp, name: string) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) =>
      do_dot(evaluate(target, { mod, env, mode }), name),
  })

export function do_dot(target: Value.Value, name: string): Value.Value {
  if (target.kind === "Value.obj") return do_dot_obj(target, name)
  if (target.kind === "Value.cls") return do_dot_cls(target, name)
  if (target.kind === "Value.mod") return do_dot_mod(target, name)
  if (target.kind === "Value.typecons") return do_dot_typecons(target, name)
  if (target.kind === "Value.not_yet") return do_dot_not_yet(target, name)
  throw new Trace.Trace(
    Explain.explain_elim_target_mismatch({
      elim: "dot",
      expecting: ["Value.obj", "Value.cls", "Value.not_yet"],
      reality: target.kind,
    })
  )
}

export function do_dot_obj(obj: Value.obj, name: string): Value.Value {
  const value = obj.properties.get(name)
  if (value === undefined)
    throw new Trace.Trace(`the property name ${name} is undefined.`)

  return value
}

export function do_dot_mod(mod: Value.mod, name: string): Value.Value {
  const value = Mod.lookup_value(mod.mod, name)
  if (value === undefined)
    throw new Trace.Trace(
      `Can not find the name ${name} in mod: ${Modpath.repr(mod.modpath)}.`
    )

  return value
}

export function do_dot_cls(cls: Value.cls, name: string): Value.Value {
  for (const entry of cls.sat) {
    if (entry.name === name) {
      return entry.t
    }
  }

  return Value.Telescope.dot(cls.tel, name)
}

export function do_dot_typecons(
  typecons: Value.typecons,
  name: string
): Value.datacons {
  const entry = typecons.delayed.sums.find(({ tag }) => tag === name)
  if (entry === undefined)
    throw new Trace.Trace(`can not find tag in typecons: ${name}`)

  return Value.datacons(
    typecons,
    name,
    evaluate(entry.t, {
      mod: typecons.delayed.mod,
      env: typecons.delayed.env,
    })
  )
}

export function do_dot_not_yet(
  not_yet: Value.not_yet,
  name: string
): Value.not_yet {
  if (not_yet.t.kind === "Value.cls")
    return Value.not_yet(
      Value.Telescope.dot(not_yet.t.tel, name),
      Neutral.dot(not_yet.neutral, name)
    )

  // TODO Handle union type here

  throw new Trace.Trace(
    Explain.explain_elim_target_type_mismatch({
      elim: "dot",
      expecting: ["Value.cls"],
      reality: not_yet.t.kind,
    })
  )
}
