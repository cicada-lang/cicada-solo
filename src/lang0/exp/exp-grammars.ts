import * as pt from "../../partech"

export const grammars = {
  zero_or_more: pt.grammars.zero_or_more,
  one_or_more: pt.grammars.one_or_more,

  $start: "exp",

  identifier: { $pattern: ["identifier"] },

  exp: {
    "exp:var": [{ name: "identifier" }],
    "exp:fn": [
      '"("',
      { name: "identifier" },
      '")"',
      '"="',
      '">"',
      { body: "exp" },
    ],
    "exp:ap": [
      { target: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
    ],
    "exp:suite": [
      '"{"',
      { defs: { $ap: ["zero_or_more", "def"] } },
      { ret: "exp" },
      '"}"',
    ],
  },

  def: {
    "def:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
  },
}
