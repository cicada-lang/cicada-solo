export declare class CommandLineInterface {
    name: string;
    version: string;
    run_code: (code: string, config: {
        [key: string]: any;
    }) => void;
    constructor(name: string, version: string, run_code: (code: string, config: {
        [key: string]: any;
    }) => void);
    run_file(file_path: string, config: {
        [key: string]: any;
    }): void;
    run(): void;
}
