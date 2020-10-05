import * as pt from "../../partech"

export const identifier = { $pattern: ["identifier"] }

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
}

export const def = {
  "def:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
}
