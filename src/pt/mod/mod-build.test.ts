import * as Mod from "../mod"
import * as ut from "../../ut"

function test(present: Mod.Present): void {
  ut.assert_equal(present, Mod.present(Mod.build(present)))
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

  test({ identifier, exp, one_or_more })
}
