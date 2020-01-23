import * as Exp from "./exp";
import * as Value from "./value";
import * as Env from "./env";
import * as Scope from "./scope";
export declare function infer(env: Env.Env, exp: Exp.Exp): Value.Value;
export declare function infer_pi(env: Env.Env, scope: Scope.Scope, return_type: Exp.Exp): Value.Value;
export declare function infer_cl(env: Env.Env, scope: Scope.Scope): Value.Value;
export declare function infer_fn(env: Env.Env, scope: Scope.Scope, body: Exp.Exp): Value.Value;
