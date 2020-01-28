export declare abstract class CommandLine {
    abstract name(): string;
    abstract version(): string;
    abstract run_code(code: string): void;
    run_file(file_path: string): void;
    run(): void;
}
