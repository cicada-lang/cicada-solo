import * as CLI from "./cli";
export declare class CicadaCommandLineInterface extends CLI.CommandLineInterface {
    name(): string;
    version(): string;
    run_code(code: string, config: {
        [key: string]: any;
    }): void;
}
