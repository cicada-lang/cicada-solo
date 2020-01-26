import * as Exp from "./exp";
import * as Value from "./value";
import * as Scope from "./scope";
export declare function pretty_exp(exp: Exp.Exp): string;
export declare function pretty_value(value: Value.Value): string;
export declare function pretty_scope(scope: Scope.Scope, delimiter: string): string;
export declare function pretty_defined(defined: Map<string, {
    t: Value.Value;
    value: Value.Value;
}>, delimiter: string): string;
export declare function indent(text: string, indentation?: string): string;
export declare function pretty_flower_block(text: string, indentation?: string): string;
