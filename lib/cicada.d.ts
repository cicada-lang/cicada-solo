import * as CMD from "./cmd";
export declare class CicadaCommandLine extends CMD.CommandLine {
    name(): string;
    version(): string;
    run_code(code: string, config: {
        [key: string]: any;
    }): void;
}
