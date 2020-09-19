import * as Closure from "../closure"

export type Value = fn | str | gr

interface fn {
  kind: "Value.fn"
  ret_cl: Closure.Closure
}

export const fn = (ret_cl: Closure.Closure): fn => ({
  kind: "Value.fn",
  ret_cl,
})

interface str {
  kind: "Value.str"
  value: string
}

export const str = (value: string): str => ({
  kind: "Value.str",
  value,
})

interface gr {
  kind: "Value.gr"
  name: string
  choices: Array<Choice>
}

export const gr = (name: string, choices: Array<Choice>): gr => ({
  kind: "Value.gr",
  name,
  choices,
})

interface Choice {
  name: string
  parts: Array<Part>
}

type Part = drop | pick

interface drop {
  kind: "Part.drop"
  value: Value
}

interface pick {
  kind: "Part.pick"
  name: string
  value: Value
}

export const part = {
  drop: (value: Value): drop => ({
    kind: "Part.drop",
    value,
  }),

  pick: (name: string, value: Value): pick => ({
    kind: "Part.pick",
    name,
    value,
  }),
}
