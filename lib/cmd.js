"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
class CommandLine {
    run_file(file_path) {
        file_path = path_1.default.join(process.cwd(), file_path);
        fs_1.default.readFile(file_path, { encoding: "utf-8" }, (error, code) => {
            if (!error) {
                this.run_code(code);
            }
            else {
                console.log(error);
            }
        });
    }
    run() {
        const program = new commander_1.default.Command();
        program
            .name(this.name())
            .version(this.version())
            .option("-e, --eval <file>", "file to eval", (file, files) => files.concat([file]), [])
            .parse(process.argv);
        let opts = program.opts();
        for (let file of opts.eval) {
            this.run_file(file);
        }
    }
}
exports.CommandLine = CommandLine;
