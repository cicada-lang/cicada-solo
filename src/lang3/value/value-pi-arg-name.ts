import * as Value from "../value"
import * as Pattern from "../pattern"

export function pi_arg_name(pi: Value.pi): string {
  const v = pi.ret_t_cl.pattern as Pattern.v
  return v.name
}
