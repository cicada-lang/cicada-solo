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
      { target: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
    ],
    "exp:let": [
      '"@"',
      '"let"',
      { name: "identifier" },
      '"="',
      { exp: "exp" },
      { ret: "exp" },
    ],
  },
}
