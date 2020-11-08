// Symbol expression (a.k.a. sexp) -- implemented by one_or_more

module.exports = {
  $start: "sexp",

  identifier: { $pattern: ["identifier"] },

  sexp: {
    "sexp:symbol": ["identifier"],
    "sexp:null": ['"("', '")"'],
    "sexp:list": ['"("', { $ap: ["one_or_more", "sexp"] }, '")"'],
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
