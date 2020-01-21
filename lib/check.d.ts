import * as Exp from "./exp";
import * as Value from "./value";
import * as Env from "./env";
import * as Scope from "./scope";
export declare function check(env: Env.Env, exp: Exp.Exp, t: Value.Value): void;
export declare function check_obj(env: Env.Env, scope: Scope.Scope): void;
export declare function check_fn(env: Env.Env, scope: Scope.Scope, body: Exp.Exp): void;
