"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indent = void 0;
function indent(text, indentation = "    ") {
    return text
        .split("\n")
        .map((line) => indentation + line)
        .join("\n");
}
exports.indent = indent;
