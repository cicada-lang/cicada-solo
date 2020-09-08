import * as Exp from "../exp";
export declare class Trace {
    message: string;
    previous: Array<Exp.Exp>;
    constructor(message: string);
}
export * from "./trace-repr";
