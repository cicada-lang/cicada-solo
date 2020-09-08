import * as Exp from "../exp";
import * as Env from "../env";
export declare class Closure {
    env: Env.Env;
    name: string;
    ret: Exp.Exp;
    constructor(env: Env.Env, name: string, ret: Exp.Exp);
}
