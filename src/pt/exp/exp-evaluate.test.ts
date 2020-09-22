import * as Exp from "../exp"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Value from "../value"
import * as DelayedChoices from "../value/delayed-choices"
import * as ut from "../../ut"

function test(
  mod: Mod.Mod,
  env: Env.Env,
  exp_present: any,
  value_present: any,
  opts: Value.PresentOpts = { on_grammar: "as_exp" }
): void {
  const exp = Exp.build(exp_present)
  const values = Exp.evaluate(mod, env, exp)
  ut.assert_equal(values.length, 1)
  const value = values[0]
  ut.assert_equal(Value.present(value, opts), value_present)
}

{
  const identifier = { $pattern: "identifier#.S*" }

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

  test(
    mod,
    env,
    ["exp"],
    {
      "exp:var": [{ name: "identifier" }],
      "exp:fn": ["(", { name: "identifier" }, ")", "=>", { body: "exp" }],
      "exp:ap": [
        { head: "identifier" },
        { tail: ["one_or_more", "(", ["exp"], ")"] },
      ],
    },
    { on_grammar: "as_exp" }
  )

  test(
    mod,
    env,
    ["one_or_more", "(", ["exp"], ")"],
    {
      "one_or_more:one": [{ value: "x" }],
      "one_or_more:more": [{ head: "x" }, { tail: ["one_or_more", "x"] }],
    },
    { on_grammar: "as_exp" }
  )

  test(
    mod,
    env,
    ["one_or_more", "(", ["exp"], ")"],
    {
      "one_or_more:one": ["(", { value: "exp" }, ")"],
      "one_or_more:more": ["(", { head: "exp" }, ")", { tail: "one_or_more" }],
    },
    { on_grammar: "force_one_step" }
  )
}
