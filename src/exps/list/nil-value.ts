import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { Nil, ListValue } from "../../cores"

export class NilValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof ListValue) {
      return new Nil()
    }
  }
}
