export const identifier = { $pattern: ["identifier", "\\S*"] }

export const exp = {
  $grammar: {
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
      { head: "identifier" },
      { tail: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
    ],
  },
}

export const one_or_more = {
  $fn: [
    "x",
    {
      $grammar: {
        "one_or_more:one": [{ value: "x" }],
        "one_or_more:more": [
          { head: "x" },
          { tail: { $ap: ["one_or_more", "x"] } },
        ],
      },
    },
  ],
}

export const $start = exp
