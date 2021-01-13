export const jo = {
  $grammar: {
    "jo:var": [{ name: "identifier" }],
    "jo:let": ['"("', { name: "identifier" }, '")"'],
    "jo:arrow": ['"["', { pre: "jos" }, '"-"', '">"', { post: "jos" }, '"]"'],
    "jo:jojo": [{ jojo: "jojo" }],
    "jo:apply": ['"!"'],
    "jo:str": ['"String"'],
    "jo:str_lit": [{ value: { $pattern: ["string"] } }],
    "jo:sym": ['"Symbol"'],
    "jo:sym_lit": ['"\'"', { value: "identifier" }],
    "jo:num": ['"Number"'],
    "jo:num_lit": [{ value: { $pattern: ["number"] } }],
    "jo:type": ['"Type"'],
  },
}

export const jos = {
  $grammar: {
    "jos:jos": [{ jos: { $ap: ["zero_or_more", "jo"] } }],
  },
}

export const jojo = {
  $grammar: {
    "jojo:jojo": ['"["', { jos: "jos" }, '"]"'],
  },
}
