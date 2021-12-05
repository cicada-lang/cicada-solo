import { Core } from "../../core"
import { Exp, ExpMeta } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"

export type ArgKind = "plain" | "implicit" | "vague"

export type ArgEntry = {
  kind: ArgKind
  exp: Exp
}

export type ArgCoreEntry = {
  kind: ArgKind
  core: Core
}

export type ArgValueEntry = {
  kind: ArgKind
  value: Value
}

export function apply_args(target: Value, args: Array<Value>): Value {
  let result: Value = target
  for (const arg of args) {
    result = Exps.ApCore.apply(result, arg)
  }

  return result
}

export function apply_arg_value_entries(
  target: Value,
  arg_value_entries: Array<ArgValueEntry>
): Value {
  let result: Value = target
  for (const arg_value_entry of arg_value_entries) {
    result = apply_arg_value_entry(result, arg_value_entry)
  }

  return result
}

export function apply_arg_value_entry(
  target: Value,
  arg_value_entry: ArgValueEntry
): Value {
  switch (arg_value_entry.kind) {
    case "plain":
      return Exps.ApCore.apply(target, arg_value_entry.value)
    case "implicit":
      return Exps.ImplicitApCore.apply(target, arg_value_entry.value)
    case "vague":
      return Exps.VagueApCore.apply(target, arg_value_entry.value)
  }
}

export function build_ap_from_arg_entry(
  target: Exp,
  arg_entry: ArgEntry,
  meta: ExpMeta
): Exp {
  switch (arg_entry.kind) {
    case "implicit": {
      return new Exps.ImplicitAp(target, arg_entry.exp, meta)
    }
    case "vague": {
      return new Exps.VagueAp(target, arg_entry.exp, meta)
    }
    case "plain": {
      return new Exps.Ap(target, arg_entry.exp, meta)
    }
  }
}

export function build_ap_from_arg_core_entry(
  target_core: Core,
  arg_core_entry: ArgCoreEntry
): Core {
  switch (arg_core_entry.kind) {
    case "implicit": {
      return new Exps.ImplicitApCore(target_core, arg_core_entry.core)
    }
    case "vague": {
      return new Exps.VagueApCore(target_core, arg_core_entry.core)
    }
    case "plain": {
      return new Exps.ApCore(target_core, arg_core_entry.core)
    }
  }
}
