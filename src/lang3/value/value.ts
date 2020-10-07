// import * as Neutral from "../neutral"
// import * as Closure from "../closure"

export type Value =
  // | pi
  // | fn
  // | equal
  // | same
  // | absurd
  // | str
  // | quote
  type
// | not_yet

export interface type {
  kind: "Value.type"
}

export const type: type = {
  kind: "Value.type",
}

// interface not_yet {
//   kind: "Value.not_yet"
//   t: Ty.Ty
//   neutral: Neutral.Neutral
// }

// export const not_yet = (t: Ty.Ty, neutral: Neutral.Neutral): not_yet => ({
//   kind: "Value.not_yet",
//   t,
//   neutral,
// })
