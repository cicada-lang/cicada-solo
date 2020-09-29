import * as Value from "../value"

// NOTE function application should always bind name to array of args.
export type Env = Map<string, Array<Value.Value>>
