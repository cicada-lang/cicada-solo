"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.explain_elim_target_type_mismatch = exports.explain_elim_target_mismatch = exports.explain_name_undefined = void 0;
const ut = __importStar(require("../../ut"));
function explain_name_undefined(name) {
    const explanation = `
    |The name ${name} is undefined.
    |`;
    return ut.aline(explanation);
}
exports.explain_name_undefined = explain_name_undefined;
function explain_elim_target_mismatch(the) {
    const explanation = `
    |This is an internal error.
    |When evaluating the eliminator ${the.elim},
    |I am expecting its target to be of the following kind:
    |  ${the.expecting.join(", ")}
    |but in reality, the kind of target I meet is ${the.reality}.
    |`;
    return ut.aline(explanation);
}
exports.explain_elim_target_mismatch = explain_elim_target_mismatch;
function explain_elim_target_type_mismatch(the) {
    const explanation = `
    |This is an internal error.
    |When evaluating the eliminator ${the.elim},
    |I am expecting its target type to be of the following kind:
    |  ${the.expecting.join(", ")}
    |but in reality, the kind of target type I meet is ${the.reality}.
    |`;
    return ut.aline(explanation);
}
exports.explain_elim_target_type_mismatch = explain_elim_target_type_mismatch;
