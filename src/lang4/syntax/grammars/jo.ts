export const jo = {
  $grammar: {
    "jo:var": [{ name: "identifier" }],
    "jo:let": ['"("', { name: "identifier" }, '")"'],
    "jo:arrow": ['"@"', '"arrow"', { pre: "jojo" }, { post: "jojo" }],
    "jo:jojo": [{ jojo: "jojo" }],
    "jo:str": ['"String"'],
    "jo:quote": [{ value: { $pattern: ["string"] } }],
    "jo:single_quote": ['"\'"', { symbol: "identifier" }],
    "jo:type": ['"Type"'],
  },
}

export const jojo = {
  $grammar: {
    "jojo:jojo": ['"["', { jos: { $ap: ["zero_or_more", "jo"] } }, '"]"'],
  },
}
