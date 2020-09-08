"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflection = exports.type = exports.quote = exports.str = exports.absurd = exports.sole = exports.trivial = exports.same = exports.equal = exports.add1 = exports.zero = exports.nat = exports.cons = exports.sigma = exports.fn = exports.pi = void 0;
exports.pi = (arg_t, closure) => ({
    kind: "Value.pi",
    arg_t,
    closure,
});
exports.fn = (closure) => ({
    kind: "Value.fn",
    closure,
});
exports.sigma = (car_t, closure) => ({
    kind: "Value.sigma",
    car_t,
    closure,
});
exports.cons = (car, cdr) => ({
    kind: "Value.cons",
    car,
    cdr,
});
exports.nat = {
    kind: "Value.nat",
};
exports.zero = {
    kind: "Value.zero",
};
exports.add1 = (prev) => ({
    kind: "Value.add1",
    prev,
});
exports.equal = (t, from, to) => ({
    kind: "Value.equal",
    t,
    from,
    to,
});
exports.same = {
    kind: "Value.same",
};
exports.trivial = {
    kind: "Value.trivial",
};
exports.sole = {
    kind: "Value.sole",
};
exports.absurd = {
    kind: "Value.absurd",
};
exports.str = {
    kind: "Value.str",
};
exports.quote = (str) => ({
    kind: "Value.quote",
    str,
});
exports.type = {
    kind: "Value.type",
};
exports.reflection = (t, neutral) => ({
    kind: "Value.reflection",
    t,
    neutral,
});
