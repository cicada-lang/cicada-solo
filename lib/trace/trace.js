"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trace = void 0;
class Trace {
    constructor(message) {
        this.message = message;
        this.previous = new Array();
    }
}
exports.Trace = Trace;
