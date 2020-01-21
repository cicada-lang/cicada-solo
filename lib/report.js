(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Report extends Error {
        constructor(message_list) {
            super(merge_message_list(message_list));
            this.message_list = message_list;
        }
        throw_append(message) {
            throw new Report([
                ...this.message_list,
                message,
            ]);
        }
        throw_prepend(message) {
            throw new Report([
                message,
                ...this.message_list,
            ]);
        }
    }
    exports.Report = Report;
    function merge_message_list(message_list) {
        let s = "";
        s += "------\n";
        for (let message of message_list) {
            s += message;
            s += "------\n";
        }
        return s;
    }
});
