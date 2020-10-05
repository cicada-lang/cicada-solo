import * as pt from "../../partech"

const preserved = ["zero", "add1", "rec"]

export const identifier = {
  $pattern: ["identifier", `^(?!(${preserved.join("|")}))`],
}

export const zero_or_more = pt.grammars.zero_or_more

export const one_or_more = pt.grammars.one_or_more

export const $start = "exp"

export const exp = {
  "exp:var": [{ name: "identifier" }],
  "exp:fn": [
    '"("',
    { name: "identifier" },
    '")"',
    '"="',
    '">"',
    { body: "exp" },
  ],
  "exp:ap": [
    { target: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
  ],
  "exp:suite": [
    '"{"',
    { defs: { $ap: ["zero_or_more", "def"] } },
    { ret: "exp" },
    '"}"',
  ],
  "exp:zero": ['"zero"'],
  "exp:add1": ['"add1"', '"("', { prev: "exp" }, '")"'],
  "exp:number": [{ value: { $pattern: ["number"] } }],
  "exp:rec": [
    '"rec"',
    '"["',
    { t: "ty" },
    '"]"',
    '"("',
    { target: "exp" },
    '","',
    { base: "exp" },
    '","',
    { step: "exp" },
    '")"',
  ],
  "exp:the": [{ exp: "exp" }, '":"', { t: "ty" }],
}

export const ty = {
  "ty:nat": ['"Nat"'],
  "ty:arrow": ['"("', { arg_t: "ty" }, '")"', '"-"', '">"', { ret_t: "ty" }],
}

export const def = {
  "def:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
  "def:claim": [
    { claim: "identifier" },
    '":"',
    { t: "ty" },
    { define: "identifier" },
    '"="',
    { exp: "exp" },
  ],
}
