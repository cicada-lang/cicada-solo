export const operator = {
  $grammar: {
    "operator:var": [{ name: "identifier" }],
    "operator:ap": [
      { target: "operator" },
      { args: { $ap: ["one_or_more", '"("', "exps", '")"'] } },
    ],
    "operator:fn": [
      '"("',
      { names: "names" },
      '")"',
      '"{"',
      { ret: "exp" },
      '"}"',
    ],
    "operator:car": ['"car"', '"("', { target: "exp" }, '")"'],
    "operator:cdr": ['"cdr"', '"("', { target: "exp" }, '")"'],
    "operator:dot_field": [
      { target: "operator" },
      '"."',
      { name: "identifier" },
    ],
    "operator:dot_method": [
      { target: "operator" },
      '"."',
      { name: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exps", '")"'] } },
    ],
    "operator:nat_ind": [
      '"nat_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "operator:nat_rec": [
      '"nat_rec"',
      '"("',
      { target: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "operator:list_ind": [
      '"list_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "operator:list_rec": [
      '"list_rec"',
      '"("',
      { target: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "operator:vector_head": ['"vector_head"', '"("', { target: "exp" }, '")"'],
    "operator:vector_tail": ['"vector_tail"', '"("', { target: "exp" }, '")"'],
    "operator:vector_ind": [
      '"vector_ind"',
      '"("',
      { length: "exp" },
      '","',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "operator:replace": [
      '"replace"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '")"',
    ],
    "operator:absurd_ind": [
      '"absurd_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '")"',
    ],
    "operator:either_ind": [
      '"either_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base_left: "exp" },
      '","',
      { base_right: "exp" },
      '")"',
    ],
    "operator:the": [
      '"the"',
      '"("',
      { t: "exp" },
      '","',
      { exp: "exp" },
      '")"',
    ],
    // NOTE about `is(exp, t)`
    // In set theory, the symbol "∈" is a stylized lowercase Greek letter epsilon ("ϵ"),
    // the first letter of the word ἐστί, which means "is".
    // - https://en.wikipedia.org/wiki/Element_(mathematics)
    "operator:is": ['"is"', '"("', { exp: "exp" }, '","', { t: "exp" }, '")"'],
  },
}

export const operand = {
  $grammar: {
    "operand:pi": [
      '"("',
      { bindings: "bindings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "operand:sigma": [
      '"("',
      { bindings: "bindings" },
      '")"',
      '"*"',
      { cdr_t: "exp" },
    ],
    "operand:cons": [
      '"cons"',
      '"("',
      { car: "exp" },
      '","',
      { cdr: "exp" },
      '")"',
    ],
    "operand:cls": [
      '"class"',
      '"{"',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"}"',
    ],
    "operand:ext": [
      '"class"',
      '"extends"',
      { parent: "operator" },
      '"{"',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"}"',
    ],
    "operand:obj": [
      '"{"',
      { properties: { $ap: ["zero_or_more", "property"] } },
      '"}"',
    ],
    "operand:nat": ['"Nat"'],
    "operand:zero": ['"zero"'],
    "operand:add1": ['"add1"', '"("', { prev: "exp" }, '")"'],
    "operand:number": [{ value: { $pattern: ["number"] } }],
    "operand:list": ['"List"', '"("', { elem_t: "exp" }, '")"'],
    "operand:nil": ['"nil"'],
    "operand:nil_sugar": ['"li"', '"!"', '"["', '"]"'],
    "operand:li": [
      '"li"',
      '"("',
      { head: "exp" },
      '","',
      { tail: "exp" },
      '")"',
    ],
    "operand:li_sugar": ['"li"', '"!"', '"["', { exps: "exps" }, '"]"'],
    "operand:vector": [
      '"Vector"',
      '"("',
      { elem_t: "exp" },
      '","',
      { length: "exp" },
      '")"',
    ],
    "operand:vecnil": ['"vecnil"'],
    "operand:vec": [
      '"vec"',
      '"("',
      { head: "exp" },
      '","',
      { tail: "exp" },
      '")"',
    ],
    "operand:vec_sugar": ['"vec"', '"!"', '"["', { exps: "exps" }, '"]"'],
    "operand:equal": [
      '"Equal"',
      '"("',
      { t: "exp" },
      '","',
      { from: "exp" },
      '","',
      { to: "exp" },
      '")"',
    ],
    "operand:same": ['"same"'],
    "operand:trivial": ['"Trivial"'],
    "operand:sole": ['"sole"'],
    "operand:absurd": ['"Absurd"'],
    "operand:str": ['"String"'],
    "operand:quote": [{ value: { $pattern: ["string"] } }],
    "operand:todo": [
      '"TODO"',
      '"("',
      { value: { $pattern: ["string"] } },
      '")"',
    ],
    "operand:either": [
      '"Either"',
      '"("',
      { left_t: "exp" },
      '","',
      { right_t: "exp" },
      '")"',
    ],
    "operand:inl": ['"inl"', '"("', { left: "exp" }, '")"'],
    "operand:inr": ['"inr"', '"("', { right: "exp" }, '")"'],
    "operand:type": ['"Type"'],
  },
}

export const declaration = {
  $grammar: {
    "declaration:let": [
      { name: "identifier" },
      '"="',
      { exp: "exp" },
      { ret: "exp" },
    ],
    "declaration:let_the": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { ret: "exp" },
    ],
    "declaration:let_fn": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      '"{"',
      { ret: "exp" },
      '"}"',
      { body: "exp" },
    ],
  },
}

export const exp = {
  $grammar: {
    "exp:operator": [{ operator: "operator" }],
    "exp:operand": [{ operand: "operand" }],
    "exp:declaration": [{ declaration: "declaration" }],
  },
}

export const cls_entry = {
  $grammar: {
    "cls_entry:field_demanded": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "cls_entry:field_fulfilled": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "cls_entry:method_demanded": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "cls_entry:method_fulfilled": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      '"{"',
      { ret: "exp" },
      '"}"',
      { $ap: ["optional", '","'] },
    ],
  },
}

export const bindings = {
  $grammar: {
    "bindings:bindings": [
      { entries: { $ap: ["zero_or_more", "binding_entry", '","'] } },
      { last_entry: "binding_entry" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const binding_entry = {
  $grammar: {
    "binding_entry:nameless": [{ exp: "exp" }],
    "binding_entry:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
    "binding_entry:multi_named": [
      { names: { $ap: ["one_or_more", "identifier"] } },
      '":"',
      { exp: "exp" },
    ],
    "binding_entry:given_named": [
      '"given"',
      { name: "identifier" },
      '":"',
      { exp: "exp" },
    ],
    "binding_entry:given_multi_named": [
      '"given"',
      { names: { $ap: ["one_or_more", "identifier"] } },
      '":"',
      { exp: "exp" },
    ],
  },
}

export const names = {
  $grammar: {
    "names:names": [
      { entries: { $ap: ["zero_or_more", "name_entry", '","'] } },
      { last_entry: "name_entry" },
      { $ap: ["optional", '","'] },
    ],
    // NOTE The following allow us to write `x, y` as `x) (y`,
    //   thus allow us to write `(x, y)` as `(x) (y)`,
    //   thus this grammar is only meaningful when used in between `(` ... `)`.
    "names:names_bracket_separated": [
      { entries: { $ap: ["zero_or_more", "name_entry", '")"', '"("'] } },
      { last_entry: "name_entry" },
    ],
  },
}

export const name_entry = {
  $grammar: {
    "name_entry:name_entry": [{ name: "identifier" }],
    "name_entry:given_name_entry": ['"given"', { name: "identifier" }],
  },
}

export const exps = {
  $grammar: {
    "exps:exps": [
      { entries: { $ap: ["zero_or_more", "exp", '","'] } },
      { last_entry: "exp" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const property = {
  $grammar: {
    "property:field_shorthand": [
      { name: "identifier" },
      { $ap: ["optional", '","'] },
    ],
    "property:field": [
      { name: "identifier" },
      '":"',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "property:method": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "property:spread": [
      '"."',
      '"."',
      '"."',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
  },
}
