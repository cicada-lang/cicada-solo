import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { readback } from "../../readback"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { check_conversion } from "../../conversion"
import { Trace } from "../../trace"
import * as Cores from "../../cores"
import * as ut from "../../ut"

export class FulfilledEntry {
  field_name: string
  local_name: string
  t: Value
  value: Value

  constructor(field_name: string, t: Value, value: Value, local_name?: string) {
    this.field_name = field_name
    this.t = t
    this.value = value
    this.local_name = local_name || field_name
  }
}
