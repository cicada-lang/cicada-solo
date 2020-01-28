"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
class CommandLine {
    run_file(file_path, config) {
        file_path = path_1.default.join(process.cwd(), file_path);
        let code = fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        this.run_code(code, config);
    }
    run() {
        const program = new commander_1.default.Command();
        program
            .name(this.name())
            .version(this.version(), "-v, --version", "output the current version")
            .option("--verbose", "print more during eval")
            .option("-e, --eval <file>", "file to eval", (file, files) => files.concat([file]), [])
            .parse(process.argv);
        let opts = program.opts();
        for (let file of opts.eval) {
            this.run_file(file, opts);
        }
    }
}
exports.CommandLine = CommandLine;
