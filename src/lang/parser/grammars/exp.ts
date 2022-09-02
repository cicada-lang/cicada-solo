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
    "operator:recursion": [
      '"recursion"',
      '"("',
      { target: "exp" },
      '")"',
      '"{"',
      { case_entries: { $ap: ["zero_or_more", "case_entry"] } },
      '"}"',
    ],
    "operator:induction": [
      '"induction"',
      '"("',
      { target: "exp" },
      '")"',
      '"{"',
      '"motive"',
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
      { typings: "typings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "operand:pi_forall": [
      '"forall"',
      '"("',
      { typings: "typings" },
      '")"',
      { ret_t: "exp" },
    ],
    "operand:fn": [
      '"("',
      { namings: "namings" },
      '")"',
      '"="',
      '">"',
      { ret: "exp" },
    ],
    "operand:fn_function": [
      '"function"',
      '"("',
      { namings: "namings" },
      '")"',
      { ret: "exp" },
    ],
    "operand:sigma_exists": [
      '"exists"',
      '"("',
      { typings: "simple_typings" },
      '")"',
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
      { properties: { $ap: ["zero_or_more", "property", '","'] } },
      { last_property: "property" },
      { $ap: ["optional", '","'] },
      '"}"',
    ],
    "operand:same_as_chart": [
      '"same_as_chart"',
      '"("',
      { t: "exp" },
      '")"',
      '"["',
      { exps: "exps" },
      '"]"',
    ],
    "operand:quote": [{ value: { $pattern: ["string"] } }],
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
      { exp: "exp" },
      '":"',
      { t: "exp" },
      { $ap: ["optional", '";"'] },
    ],
    "sequence_entry:let_fn": [
      '"function"',
      { name: "identifier" },
      '"("',
      { typings: "typings" },
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
    "cls_entry:field_abstract": [
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
    "cls_entry:method_abstract": [
      { name: "identifier" },
      '"("',
      { typings: "typings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "cls_entry:method_fulfilled": [
      { name: "identifier" },
      '"("',
      { typings: "typings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { sequence: "sequence" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const simple_typings = {
  $grammar: {
    "simple_typings:simple_typings": [
      { entries: { $ap: ["zero_or_more", "simple_typing", '","'] } },
      { last_entry: "simple_typing" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const simple_typing = {
  $grammar: {
    "simple_typing:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const typings = {
  $grammar: {
    "typings:typings": [
      { entries: { $ap: ["zero_or_more", "typing", '","'] } },
      { last_entry: "typing" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const typing = {
  $grammar: {
    "typing:nameless": [{ exp: "exp" }],
    "typing:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
    "typing:implicit": [
      '"implicit"',
      { name: "identifier" },
      '":"',
      { exp: "exp" },
    ],
    "typing:vague": ['"vague"', { name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const namings = {
  $grammar: {
    "namings:namings": [
      { entries: { $ap: ["zero_or_more", "naming", '","'] } },
      { last_entry: "naming" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const naming = {
  $grammar: {
    "naming:naming": [{ name: "identifier" }],
    "naming:implicit_naming": ['"implicit"', { name: "identifier" }],
    "naming:vague_naming": ['"vague"', { name: "identifier" }],
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
      { namings: "namings" },
      '")"',
      { sequence: "sequence" },
    ],
    "property:spread": ['"."', '"."', '"."', { exp: "exp" }],
  },
}
