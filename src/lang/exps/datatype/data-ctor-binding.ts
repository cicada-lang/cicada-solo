import * as Exps from ".."
import { Core } from "../../core"
import { Exp } from "../../exp"

export type DataCtorBinding = {
  kind: Exps.ArgKind
  name: string
  exp: Exp
}

export type DataCtorCoreBinding = {
  kind: Exps.ArgKind
  name: string
  core: Core
}
