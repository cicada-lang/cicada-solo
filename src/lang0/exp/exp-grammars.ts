export const grammars = {
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
    "def:def": ["identifier", '"="', "exp"],
  },

  zero_or_more: {
    $fn: [
      "x",
      {
        "zero_or_more:null": [],
        "zero_or_more:more": [
          { head: "x" },
          { tail: { $ap: ["zero_or_more", "x"] } },
        ],
      },
    ],
  },

  one_or_more: {
    $fn: [
      "x",
      {
        "one_or_more:one": [{ value: "x" }],
        "one_or_more:more": [
          { head: "x" },
          { tail: { $ap: ["one_or_more", "x"] } },
        ],
      },
    ],
  },
}
