export const jo = {
  $grammar: {
    "jo:var": [{ name: "identifier" }],
    "jo:let": ['"("', { name: "identifier" }, '")"'],
    "jo:arrow": ['"@"', '"arrow"', { pre: "jojo" }, { post: "jojo" }],
    "jo:jojo": [{ jojo: "jojo" }],
    "jo:str": ['"String"'],
    "jo:str_lit": [{ value: { $pattern: ["string"] } }],
    "jo:sym": ['"Symbol"'],
    "jo:sym_lit": ['"\'"', { symbol: "identifier" }],
    "jo:type": ['"Type"'],
  },
}

export const jojo = {
  $grammar: {
    "jojo:jojo": ['"["', { jos: { $ap: ["zero_or_more", "jo"] } }, '"]"'],
  },
}
