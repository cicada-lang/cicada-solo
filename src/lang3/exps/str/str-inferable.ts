import { Inferable } from "../../inferable"
import * as Value from "../../value"

export const str_inferable = Inferable({
  inferability: ({ mod, ctx }) => Value.type,
})
