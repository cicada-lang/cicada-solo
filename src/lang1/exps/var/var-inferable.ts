import { Inferable } from "../../inferable"
import * as Ctx from "../../ctx"
import * as Explain from "../../explain"
import * as Trace from "../../../trace"

export const var_inferable = (name: string) =>
  Inferable({
    inferability: ({ ctx }) => {
      throw new Error()
    },
  })
