import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Nil, ListValue } from "../../cores"

export class NilValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof ListValue) {
      return new Nil()
    }
  }
}
