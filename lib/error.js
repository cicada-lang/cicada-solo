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
    class ErrorReport extends Error {
        constructor(message_list) {
            super(merge_message_list(message_list));
            this.message_list = message_list;
        }
        append(message) {
            new ErrorReport([
                ...this.message_list,
                message,
            ]);
        }
        prepend(message) {
            new ErrorReport([
                message,
                ...this.message_list,
            ]);
        }
    }
    exports.ErrorReport = ErrorReport;
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
