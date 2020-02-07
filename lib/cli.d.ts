export declare abstract class CommandLineInterface {
    abstract name(): string;
    abstract version(): string;
    abstract run_code(code: string, config: {
        [key: string]: any;
    }): void;
    run_file(file_path: string, config: {
        [key: string]: any;
    }): void;
    run(): void;
}
