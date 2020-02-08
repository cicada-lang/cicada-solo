"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("@forchange/partech/lib/error");
const earley_1 = require("@forchange/partech/lib/earley");
const parser_1 = require("@forchange/partech/lib/parser");
const ptc = __importStar(require("@forchange/partech/lib/predefined"));
const CLI = __importStar(require("./cli"));
const API = __importStar(require("./api"));
const grammar = __importStar(require("./grammar"));
const pkg = require("../package.json");
function run_code(code, config) {
    const lexer = ptc.common_lexer;
    const partech = new earley_1.Earley();
    const parser = new parser_1.Parser(lexer, partech, grammar.top_list());
    try {
        let tree = parser.parse(code);
        let top_list = grammar.top_list_matcher(tree);
        API.run(top_list, config);
    }
    catch (error) {
        if (error instanceof error_1.ErrorDuringParsing) {
            console.log(`parsing error, at ${error.span.repr()}`);
            error.span.report_in_context(code);
            console.log(`${error.message}`);
            process.exit(1);
        }
        else {
            throw error;
        }
    }
}
exports.cli = new CLI.CommandLineInterface(pkg.name, pkg.version, run_code);
