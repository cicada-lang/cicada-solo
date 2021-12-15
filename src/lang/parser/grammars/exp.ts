export const operator = {
  $grammar: {
    "operator:var": [{ name: "identifier" }],
    "operator:ap": [
      { target: "operator" },
      {
        arg_entries_group: {
          $ap: ["one_or_more", '"("', "arg_entries", '")"'],
        },
      },
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
      {
        arg_entries_group: {
          $ap: ["one_or_more", '"("', "arg_entries", '")"'],
        },
      },
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
    "operator:induction": [
      '"induction"',
      '"("',
      { target: "exp" },
      '")"',
      '"{"',
      { motive: "exp" },
      { case_entries: { $ap: ["zero_or_more", "case_entry"] } },
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
      '"("',
      { t: "exp" },
      '")"',
      '"["',
      { exps: "exps" },
      '"]"',
    ],
    "operand:trivial": ['"Trivial"'],
    "operand:sole": ['"sole"'],
    "operand:absurd": ['"Absurd"'],
    "operand:str": ['"String"'],
    "operand:quote": [{ value: { $pattern: ["string"] } }],
    "operand:type": ['"Type"'],
  },
}

export const exp = {
  $grammar: {
    "exp:operator": [{ operator: "operator" }],
    "exp:operand": [{ operand: "operand" }],
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

export const sequence_entry = {
  $grammar: {
    "sequence_entry:let": [
      '"let"',
      { name: "identifier" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '";"'] },
    ],
    "sequence_entry:let_the": [
      '"let"',
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '";"'] },
    ],
    "sequence_entry:check": [
      '"check"',
      '"!"',
      { exp: "exp" },
      '":"',
      { t: "exp" },
      { $ap: ["optional", '";"'] },
    ],
    "sequence_entry:let_fn": [
      '"function"',
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
      { sequence: "sequence" },
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
    "binding:vague": ['"vague"', { name: "identifier" }, '":"', { exp: "exp" }],
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
    "name_entry:vague_name_entry": ['"vague"', { name: "identifier" }],
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

export const arg_entries = {
  $grammar: {
    "arg_entries:arg_entries": [
      { entries: { $ap: ["zero_or_more", "arg_entry", '","'] } },
      { last_entry: "arg_entry" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const arg_entry = {
  $grammar: {
    "arg_entry:plain": [{ arg: "exp" }],
    "arg_entry:implicit": ['"implicit"', { arg: "exp" }],
    "arg_entry:vague": ['"vague"', { arg: "exp" }],
  },
}

export const case_entry = {
  $grammar: {
    "case_entry:normal": ['"case"', { name: "identifier" }, { exp: "exp" }],
    "case_entry:nullary": [
      '"case"',
      { name: "identifier" },
      '"="',
      '">"',
      { exp: "exp" },
    ],
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
      { sequence: "sequence" },
    ],
    "property:spread": ['"."', '"."', '"."', { exp: "exp" }],
  },
}
