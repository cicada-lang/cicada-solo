import * as Exp from "../exp"
import * as ut from "../../ut"

function test(present: Exp.Present): void {
  ut.assert_equal(present, Exp.present(Exp.build(present)))
}

{
  const mod = {
    exp: {
      "exp:var": [{ name: "identifier" }],
      "exp:fn": ["(", { name: "identifier" }, ")", "=>", { body: "exp" }],
      "exp:ap": [
        { head: "identifier" },
        { tail: ["one_or_more", "(", ["exp"], ")"] },
      ],
    },
    one_or_more: {
      $fn: [
        "x",
        {
          "one_or_more:one": [{ value: "x" }],
          "one_or_more:more": [{ head: "x" }, { tail: ["one_or_more", "x"] }],
        },
      ],
    },
  }

  test(mod.exp)
  test(mod.one_or_more)
}
