import { Core } from "../../core"
import { Exp } from "../../exp"
import { Normal } from "../../normal"
import { Value } from "../../value"

export type CaseEntry = {
  nullary: boolean
  name: string
  exp: Exp
}

export type CaseCoreEntry = {
  nullary: boolean
  name: string
  core: Core
}

export type CaseValueEntry = {
  nullary: boolean
  name: string
  value: Value
}

export type CaseNormalEntry = {
  nullary: boolean
  name: string
  normal: Normal
}

export function compare_case_entries(
  this_case_entry: { name: string },
  that_case_entry: { name: string },
): -1 | 0 | 1 {
  if (this_case_entry.name < that_case_entry.name) return -1
  if (this_case_entry.name > that_case_entry.name) return 1
  else return 0
}
