import { Exp } from "../../exp"
import { Core } from "../../core"
import { Normal } from "../../normal"

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

export type CaseNormalEntry = {
  nullary: boolean
  name: string
  normal: Normal
}
