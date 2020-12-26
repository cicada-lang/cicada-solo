export const jo = {
  $grammar: {
    "jo:var": [{ name: "identifier" }],
    "jo:let": ['"("', '"let"', { name: "identifier" }, '")"'],
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
