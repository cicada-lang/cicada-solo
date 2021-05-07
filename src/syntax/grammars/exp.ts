export const exp = {
  $grammar: {
    "exp:var": [{ name: "identifier" }],
    "exp:pi": [
      { $ap: ["optional", '"@"', '"forall"'] },
      '"("',
      { bindings: "bindings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "exp:fn": ['"("', { names: "names" }, '")"', '"="', '">"', { ret: "exp" }],
    "exp:ap": [
      { target: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exps", '")"'] } },
    ],
    "exp:sigma": [
      { $ap: ["optional", '"@"', '"exists"'] },
      '"("',
      { name: "identifier" },
      '":"',
      { car_t: "exp" },
      '"*"',
      { cdr_t: "exp" },
      '")"',
    ],
    "exp:pair": ['"("', { car_t: "exp" }, '"*"', { cdr_t: "exp" }, '")"'],
    "exp:cons": ['"cons"', '"("', { car: "exp" }, '","', { cdr: "exp" }, '")"'],
    "exp:car": ['"car"', '"("', { target: "exp" }, '")"'],
    "exp:cdr": ['"cdr"', '"("', { target: "exp" }, '")"'],
    "exp:cls": [
      '"["',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"]"',
    ],
    "exp:ext": [
      '"@"',
      '"extends"',
      { parent_name: "identifier" },
      '"["',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"]"',
    ],
    "exp:obj": [
      '"{"',
      { properties: { $ap: ["zero_or_more", "property"] } },
      '"}"',
    ],
    "exp:dot_field": [{ target: "exp" }, '"."', { name: "identifier" }],
    "exp:dot_method": [
      { target: "exp" },
      '"."',
      { name: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exps", '")"'] } },
    ],
    "exp:nat": ['"Nat"'],
    "exp:zero": ['"zero"'],
    "exp:add1": ['"add1"', '"("', { prev: "exp" }, '")"'],
    "exp:number": [{ value: { $pattern: ["number"] } }],
    "exp:nat_ind": [
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
    "exp:nat_rec": [
      '"nat_rec"',
      '"("',
      { target: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "exp:list": ['"List"', '"("', { elem_t: "exp" }, '")"'],
    "exp:nil": ['"nil"'],
    "exp:li": ['"li"', '"("', { head: "exp" }, '","', { tail: "exp" }, '")"'],
    "exp:li_sugar": ['"@"', '"li"', '"["', { exps: "exps" }, '"]"'],
    "exp:list_ind": [
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
    "exp:list_rec": [
      '"list_rec"',
      '"("',
      { target: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "exp:vector": [
      '"Vector"',
      '"("',
      { elem_t: "exp" },
      '","',
      { length: "exp" },
      '")"',
    ],
    "exp:vecnil": ['"vecnil"'],
    "exp:vec": ['"vec"', '"("', { head: "exp" }, '","', { tail: "exp" }, '")"'],
    "exp:vec_sugar": ['"@"', '"vec"', '"["', { exps: "exps" }, '"]"'],
    "exp:vector_head": ['"vector_head"', '"("', { target: "exp" }, '")"'],
    "exp:vector_tail": ['"vector_tail"', '"("', { target: "exp" }, '")"'],
    "exp:equal": [
      '"Equal"',
      '"("',
      { t: "exp" },
      '","',
      { from: "exp" },
      '","',
      { to: "exp" },
      '")"',
    ],
    "exp:same": ['"same"'],
    "exp:replace": [
      '"replace"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '")"',
    ],
    "exp:trivial": ['"Trivial"'],
    "exp:sole": ['"sole"'],
    "exp:absurd": ['"Absurd"'],
    "exp:absurd_ind": [
      '"absurd_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '")"',
    ],
    "exp:str": ['"String"'],
    "exp:quote": [{ value: { $pattern: ["string"] } }],
    "exp:type": ['"Type"'],
    "exp:let": [
      '"@"',
      '"let"',
      { name: "identifier" },
      '"="',
      { exp: "exp" },
      { ret: "exp" },
    ],
    "exp:the": ['"@"', '"the"', { t: "exp" }, { exp: "exp" }],
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
      '"="',
      { ret: "exp" },
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
  },
}

export const names = {
  $grammar: {
    "names:names": [
      { entries: { $ap: ["zero_or_more", "identifier", '","'] } },
      { last_entry: "identifier" },
      { $ap: ["optional", '","'] },
    ],
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
  },
}
