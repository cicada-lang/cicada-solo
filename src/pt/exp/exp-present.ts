import * as Exp from "../exp"
import { Obj } from "../../ut"

export function present(exp: Exp.Exp): Obj<any> {
  return {}
}

{
  const _ = {
    exp: {
      "exp:var": [{ name: "identifier" }],
      "exp:fn": ["(", { name: "identifier" }, ")", "=>", { body: "exp" }],
      "exp:ap": [
        { head: "identifier" },
        { tail: ["one_or_more", "(", ["exp"], ")"] },
      ],
    },
    "one_or_more(x)": {
      "one_or_more:one": [{ value: "x" }],
      "one_or_more:more": [{ head: "x" }, { tail: ["one_or_more", "x"] }],
    },
  }
}
