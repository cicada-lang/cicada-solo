// Symbol expression (a.k.a. sexp) -- implemented by zero_or_more

const { pt } = require("../..")

module.exports = {
  zero_or_more: pt.grammars.zero_or_more,

  $start: "sexp",

  identifier: { $pattern: ["identifier"] },

  sexp: {
    $grammar: {
      "sexp:symbol": ["identifier"],
      "sexp:list": ['"("', { $ap: ["zero_or_more", "sexp"] }, '")"'],
    },
  },
}
