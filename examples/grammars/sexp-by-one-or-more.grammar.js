// Symbol expression (a.k.a. sexp) -- implemented by one_or_more

const { pt } = require("../..")

module.exports = {
  one_or_more: pt.grammars.one_or_more,

  $start: "sexp",

  identifier: { $pattern: ["identifier"] },

  sexp: {
    "sexp:symbol": ["identifier"],
    "sexp:null": ['"("', '")"'],
    "sexp:list": ['"("', { $ap: ["one_or_more", "sexp"] }, '")"'],
  },
}
