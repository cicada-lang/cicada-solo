"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.equal = void 0;
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
// NOTE The module "fast-deep-equal": https://github.com/epoberezkin/fast-deep-equal
// Comparison details of Node's `assert.deepEqual()`:
//   https://nodejs.org/api/all.html#assert_assert_deepstrictequal_actual_expected_message
function equal(x, y) {
    return fast_deep_equal_1.default(x, y);
}
exports.equal = equal;
