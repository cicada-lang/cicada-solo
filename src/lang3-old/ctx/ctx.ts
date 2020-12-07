import * as Value from "../value"

// NOTE side effect API,
//   one needs to clone the env as needed.
export type Ctx = Map<
  string,
  {
    t: Value.Value
    value?: Value.Value
  }
>
