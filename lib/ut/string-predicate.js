"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty_line_p = exports.blank_p = void 0;
function blank_p(blank) {
    let result = true;
    for (let i = 0; i < blank.length; i++) {
        let char = blank[i];
        if (char !== " " && char !== "\t" && char !== "\n") {
            return false;
        }
    }
    return result;
}
exports.blank_p = blank_p;
function empty_line_p(line) {
    let result = true;
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char !== " " && char !== "\t") {
            return false;
        }
    }
    return result;
}
exports.empty_line_p = empty_line_p;
