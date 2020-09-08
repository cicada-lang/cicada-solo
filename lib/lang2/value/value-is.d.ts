import * as Value from "../value";
import * as Ctx from "../ctx";
export declare function is_pi(ctx: Ctx.Ctx, value: Value.Value): Value.pi;
export declare function is_sigma(ctx: Ctx.Ctx, value: Value.Value): Value.sigma;
export declare function is_nat(ctx: Ctx.Ctx, value: Value.Value): Value.nat;
export declare function is_equal(ctx: Ctx.Ctx, value: Value.Value): Value.equal;
export declare function is_absurd(ctx: Ctx.Ctx, value: Value.Value): Value.absurd;
export declare function is_trivial(ctx: Ctx.Ctx, value: Value.Value): Value.trivial;
export declare function is_str(ctx: Ctx.Ctx, value: Value.Value): Value.str;
