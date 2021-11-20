export const operator = {
  $grammar: {
    "operator:var": [{ name: "identifier" }],
    "operator:ap": [
      { target: "operator" },
      { args: { $ap: ["one_or_more", '"("', "args", '")"'] } },
    ],
    "operator:sequence_begin": [{ sequence: "sequence" }],
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
    "operator:elab": ['"@"', '"elab"', { exp: "exp" }],
    "operator:elaborate": ['"@"', '"elaborate"', { exp: "exp" }],
  },
}

export const sequence = {
  $grammar: {
    "sequence:sequence": [
      '"{"',
      { entries: { $ap: ["zero_or_more", "sequence_entry"] } },
      '"return"',
      { ret: "exp" },
      '"}"',
    ],
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
    "operand:pi_for_all": [
      '"for"',
      '"all"',
      '"("',
      { bindings: "bindings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "operand:fn": [
      '"("',
      { names: "names" },
      '")"',
      '"="',
      '">"',
      { ret: "exp" },
    ],
    "operand:sigma": [
      '"["',
      { bindings: "simple_bindings" },
      '"|"',
      { cdr_t: "exp" },
      '"]"',
    ],
    "operand:sigma_there_exists": [
      '"there"',
      '"exists"',
      '"["',
      { bindings: "simple_bindings" },
      '"such"',
      '"that"',
      { cdr_t: "exp" },
      '"]"',
    ],
    "operand:pair": [
      '"Pair"',
      '"("',
      { car_t: "exp" },
      '","',
      { cdr_t: "exp" },
      '")"',
    ],
    "operand:cons": [
      '"cons"',
      '"("',
      { car: "exp" },
      '","',
      { cdr: "exp" },
      '")"',
    ],
    "operand:cons_sugar": [
      '"["',
      { exps: "exps" },
      '"|"',
      { tail: "exp" },
      '"]"',
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
      { properties: { $ap: ["zero_or_more", "property", '","'] } },
      { last_property: "property" },
      { $ap: ["optional", '","'] },
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
    "operand:refl": ['"refl"'],
    "operand:same": ['"same"', '"("', { exp: "exp" }, '")"'],
    "operand:the_same": [
      '"the_same"',
      '"("',
      { t: "exp" },
      '","',
      { exp: "exp" },
      '")"',
    ],
    "operand:same_as_chart": [
      '"same_as_chart"',
      '"!"',
      { t: "exp" },
      '"["',
      { exps: "exps" },
      '"]"',
    ],
    "operand:trivial": ['"Trivial"'],
    "operand:sole": ['"sole"'],
    "operand:absurd": ['"Absurd"'],
    "operand:str": ['"String"'],
    "operand:quote": [{ value: { $pattern: ["string"] } }],
    "operand:todo": ['"@"', '"TODO"', { value: { $pattern: ["string"] } }],
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

export const sequence_entry = {
  $grammar: {
    "sequence_entry:let": [
      { name: "identifier" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '";"'] },
    ],
    "sequence_entry:let_the": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '";"'] },
    ],
    "sequence_entry:let_fn": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { sequence: "sequence" },
      { $ap: ["optional", '";"'] },
    ],
  },
}

export const exp = {
  $grammar: {
    "exp:operator": [{ operator: "operator" }],
    "exp:operand": [{ operand: "operand" }],
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
      // TODO
      '"{"',
      { ret: "exp" },
      '"}"',
      { $ap: ["optional", '","'] },
    ],
  },
}

export const simple_bindings = {
  $grammar: {
    "simple_bindings:simple_bindings": [
      { entries: { $ap: ["zero_or_more", "simple_binding", '","'] } },
      { last_entry: "simple_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const simple_binding = {
  $grammar: {
    "simple_binding:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const bindings = {
  $grammar: {
    "bindings:bindings": [
      { entries: { $ap: ["zero_or_more", "binding", '","'] } },
      { last_entry: "binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const binding = {
  $grammar: {
    "binding:nameless": [{ exp: "exp" }],
    "binding:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
    "binding:implicit": [
      '"implicit"',
      { name: "identifier" },
      '":"',
      { exp: "exp" },
    ],
    "binding:fixed": ['"fixed"', { name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const names = {
  $grammar: {
    "names:names": [
      { entries: { $ap: ["zero_or_more", "name_entry", '","'] } },
      { last_entry: "name_entry" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const name_entry = {
  $grammar: {
    "name_entry:name_entry": [{ name: "identifier" }],
    "name_entry:implicit_name_entry": ['"implicit"', { name: "identifier" }],
    "name_entry:fixed_name_entry": ['"fixed"', { name: "identifier" }],
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

export const args = {
  $grammar: {
    "args:args": [
      { entries: { $ap: ["zero_or_more", "arg_entry", '","'] } },
      { last_entry: "arg_entry" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const arg_entry = {
  $grammar: {
    "arg_entry:plain": [{ exp: "exp" }],
    "arg_entry:implicit": ['"implicit"', { exp: "exp" }],
  },
}

export const property = {
  $grammar: {
    "property:field_shorthand": [{ name: "identifier" }],
    "property:field": [{ name: "identifier" }, '":"', { exp: "exp" }],
    "property:method": [
      { name: "identifier" },
      '"("',
      { names: "names" },
      '")"',
      // TODO
      '"{"',
      { ret: "exp" },
      '"}"',
    ],
    "property:spread": ['"."', '"."', '"."', { exp: "exp" }],
  },
}
