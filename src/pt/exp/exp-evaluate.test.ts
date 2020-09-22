import * as Exp from "../exp"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Value from "../value"
import * as GrammarThunk from "../value/grammar-thunk"
import * as ut from "../../ut"

{
  const identifier = { $pattern: "identifier:.S*" }

  const exp = {
    "exp:var": [{ name: "identifier" }],
    "exp:fn": ["(", { name: "identifier" }, ")", "=>", { body: "exp" }],
    "exp:ap": [
      { head: "identifier" },
      { tail: ["one_or_more", "(", ["exp"], ")"] },
    ],
  }

  const one_or_more = {
    $fn: [
      "x",
      {
        "one_or_more:one": [{ value: "x" }],
        "one_or_more:more": [{ head: "x" }, { tail: ["one_or_more", "x"] }],
      },
    ],
  }

  const mod = Mod.build({ identifier, exp, one_or_more })
  const env = new Map()
  const values = Exp.evaluate(mod, env, Exp.v("exp"))
  const value = values[0]
  if (value.kind === "Value.grammar") {
    const choices = GrammarThunk.reify_choices(value.grammar_thunk)
    for (const [name, parts] of choices) {
      console.log("name:", name)
      console.log("parts:")
      for (const part of parts) {
        const { value } = part
        if (value.kind === "Value.grammar") {
          const choices = GrammarThunk.reify_choices(value.grammar_thunk)
          for (const [name, parts] of choices) {
            console.log(parts)
          }
        }
      }
      console.log()
    }
  } else {
    console.log(ut.inspect(value))
  }
}
