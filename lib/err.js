"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Report extends Error {
    constructor(message_list) {
        super(merge_message_list(message_list));
        this.message_list = message_list;
    }
    append(message) {
        return new Report([
            ...this.message_list,
            message,
        ]);
    }
    prepend(message) {
        return new Report([
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
exports.merge_message_list = merge_message_list;
class Unhandled extends Error {
    constructor(value) {
        super(message_for_unhandled(value));
        this.value = value;
    }
}
exports.Unhandled = Unhandled;
function message_for_unhandled(value) {
    if (value.abstract_class_name) {
        let message = `unhandled class of abstract class ${value.abstract_class_name}: ${value.constructor.name}\n` +
            `value: ${JSON.stringify(value, null, 2)}\n`;
        return message;
    }
    else {
        let message = `unhandled class (no abstract_class_name): ${value.constructor.name}\n` +
            `value: ${JSON.stringify(value, null, 2)}\n`;
        return message;
    }
}
