import { Inferable } from "../../inferable"
import * as Readback from "../../readback"
import * as Value from "../../value"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const quote_inferable = (str: string) =>
  Inferable({
    inferability: ({ mod, ctx }) => Value.quote(str),
  })
