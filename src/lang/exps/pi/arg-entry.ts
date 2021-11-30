import { Exp, ExpMeta } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Exps from "../../exps"

export type ArgEntry = {
  kind: "plain" | "implicit" | "vague"
  arg: Exp
}

export type ArgCoreEntry = {
  kind: "plain" | "implicit" | "vague"
  arg: Core
}

export type ArgValueEntry = {
  kind: "plain" | "implicit" | "vague"
  arg: Value
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
      return new Exps.ImplicitApCore(target_core, arg_core_entry.arg)
    }
    case "vague": {
      return new Exps.VagueApCore(target_core, arg_core_entry.arg)
    }
    case "plain": {
      return new Exps.ApCore(target_core, arg_core_entry.arg)
    }
  }
}
