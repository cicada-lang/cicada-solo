import * as Trace from "../trace";
export declare function repr<T>(trace: Trace.Trace<T>, formater: (x: T) => string): string;
