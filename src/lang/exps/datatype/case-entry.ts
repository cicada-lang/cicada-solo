import { Exp } from "../../exp"
import { Core } from "../../core"

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
