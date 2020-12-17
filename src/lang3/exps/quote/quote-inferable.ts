import { Inferable } from "../../inferable"
import * as Value from "../../value"

export const quote_inferable = (str: string) =>
  Inferable({
    inferability: ({ mod, ctx }) => Value.quote(str),
  })
