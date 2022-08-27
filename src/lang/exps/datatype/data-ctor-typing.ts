import * as Exps from ".."
import { Core } from "../../core"
import { Exp } from "../../exp"

export type DataCtorTyping = {
  kind: Exps.ArgKind
  name: string
  exp: Exp
}

export type DataCtorCoreTyping = {
  kind: Exps.ArgKind
  name: string
  core: Core
}
