import * as Value from "../value"

export type Env = Map<string, Array<Value.Value>>

// NOTE function application should always bind name to array of args.
// - fn
//   one_or_more = (x) => {
//     one_or_more:one -> (value: x)
//     one_or_more:more -> (head: x) (tail: one_or_more(x))
//   }
// - ap
//   one_or_more("(" x ")")
// - result
//   {
//     one_or_more:one -> "(" (value: x) ")"
//     one_or_more:more -> "(" (head: x) ")" (tail: one_or_more("(" x ")"))
//   }
