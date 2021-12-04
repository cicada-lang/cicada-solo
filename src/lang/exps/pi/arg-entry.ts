import { Exp, ExpMeta } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export type ArgKind = "plain" | "implicit" | "vague"

export type ArgEntry = {
  kind: ArgKind
  arg: Exp
}

export type ArgCoreEntry = {
  kind: ArgKind
  core: Core
}

export type ArgValueEntry = {
  kind: ArgKind
  value: Value
}

export function wrap_arg_entry(
  target: Exp,
  arg_entry: ArgEntry,
  meta: ExpMeta
): Exp {
  switch (arg_entry.kind) {
    case "implicit": {
      return new Exps.ImplicitAp(target, arg_entry.arg, meta)
    }
    case "vague": {
      return new Exps.VagueAp(target, arg_entry.arg, meta)
    }
    case "plain": {
      return new Exps.Ap(target, arg_entry.arg, meta)
    }
  }
}

export function wrap_arg_core_entry(
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
